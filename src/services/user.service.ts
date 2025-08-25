import { ActorSubclass, Principal } from '@ic-reactor/react/dist/types';
import { BaseService } from './base.service';
import {
  _SERVICE as UserCanisterService,
  User,
} from '../declarations/user/user.did';
import {
  canisterId as userCanisterId,
  createActor as createUserActor,
} from '../declarations/user';
import { firstOrDefault } from '../utils/service-utils';

export class UserService extends BaseService<UserCanisterService> {
  private II_URL =
    process.env.DFX_NETWORK === 'ic'
      ? 'https://identity.ic0.app'
      : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;

  constructor() {
    super(userCanisterId, createUserActor);
  }

  public async getUserByPrincipal(principal: Principal): Promise<User | null> {
    try {
      const response = await this.actor.getUser(principal);
      return firstOrDefault(response);
    } catch (error) {
      console.error('Error fetching user by principal:', error);
      if (
        error instanceof Error &&
        error.message.includes('Certificate verification')
      ) {
        await BaseService.refreshAgent();
        try {
          const response = await this.actor.getUser(principal);
          return firstOrDefault(response);
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          throw retryError;
        }
      }
      throw error;
    }
  }

  public async addUser(user: User): Promise<User | null> {
    console.log('Adding user:', user);
    try {
      const response = await this.actor.addUser(user);
      console.log('User added:', response);
      return firstOrDefault(response);
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  public async login(): Promise<User | null> {
    return new Promise<User | null>(async (resolve, reject) => {
      try {
        await BaseService.authClient.login({
          identityProvider: this.II_URL,
          onSuccess: async () => {
            try {
              await BaseService.refreshAgent();
              const identity = await BaseService.getCallerIdentity();
              const principal = identity.getPrincipal();

              let existingUser = await this.getUserByPrincipal(principal);

              if (!existingUser) {
                const newUser: User = {
                  id: principal,
                  name: 'User',
                  email: '',
                  bio: '',
                  profilePicture: [],
                };
                existingUser = await this.addUser(newUser);
              }

              resolve(existingUser);
            } catch (setupError) {
              console.error('Post-login setup error:', setupError);
              reject(setupError);
            }
          },
          onError: (error) => {
            console.error('Login error:', error);
            reject(error);
          },
        });
      } catch (error) {
        console.error('Login failed:', error);
        reject(error);
      }
    });
  }

  public async updateUser(user: User): Promise<boolean> {
    try {
      const principal = await BaseService.getCallerPrincipal();
      if (principal.isAnonymous()) {
        throw new Error('User is not authenticated');
      }
      console.log('Updating user:', user);
      const response = await this.actor.updateUser(user.id, user);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  public async me(): Promise<User | null> {
    try {
      const isAuth = await BaseService.isAuthenticated();
      if (!isAuth) {
        return null;
      }

      const principal = await BaseService.getCallerPrincipal();
      if (principal.isAnonymous()) {
        return null;
      }

      return this.getUserByPrincipal(principal);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Certificate verification')
      ) {
        console.warn('Certificate verification failed in me(), returning null');
        return null;
      }
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  public async checkAuthenticate(): Promise<boolean> {
    try {
      return await BaseService.isAuthenticated();
    } catch (error) {
      return false;
    }
  }

  public async logout(): Promise<void> {
    try {
      await BaseService.authClient.logout();
      await BaseService.refreshAgent();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
}
