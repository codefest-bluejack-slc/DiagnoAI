import { HistoryService } from '../services/history.service';
import { SymptomService } from '../services/symptom.service';
import { UserService } from '../services/user.service';

export interface IServiceContextType {
  userService: UserService;
  historyService: HistoryService;
  symptomService: SymptomService;
}
