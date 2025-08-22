# DiagnoAI 🏥🤖

## Introduction  
**DiagnoAI** is an AI-powered healthcare assistant designed to provide end-to-end support for users seeking medical guidance. The application integrates intelligent agents with a medicine marketplace to deliver:  
1. **Diagnosis** from symptoms.  
2. **Personalized treatment recommendations.**  
3. **Easy access to purchase trusted medicines.**

The system is powered by **Fetch.ai** library and **Internet Computer Protocol (ICP)** for decentralized application using **Internet Identity**.  

### AI Agents  
1. **Diagnosis Agent** 🧠  
   - Accepts user symptom descriptions.  
   - Provides a probable **diagnosis** with structured output.  

2. **Recommendation Agent** 💊  
   - Suggests **relevant medicines** based on the diagnosis.  
   - Provides **guidelines on safe usage** for each medicine.  

### Medicine Marketplace 
   - Users can **find, compare, and purchase** medicines from trusted pharmacies.  
   - Offers a **seamless pipeline**: diagnosis → treatment guidance → medicine purchase.  

---

## Architecture Description  

- **Frontend:** React for building a user-friendly web interface.  
- **Backend:** Motoko (deployed on ICP) to handle decentralized data and backend application
- **AI Layer:** Python-based agents using **Fetch.ai** libraries for agentic AI functionality.  

---

## Build and Deployment Instructions (Local Development)

#### 1. Deploy ICP Canisters  
Run the following command to create and deploy all canisters, and start the local connection:  
```bash
npm run setup
```

#### 2. Start the Frontend
Once canisters are deployed, start the React frontend with:
```bash
npm start
```

#### 3. Run AI Agents + Services
All AI agents are built with Python and containerized using Docker.
Navigate to the agents/ directory and run:
```bash
docker compose up --build
```
This will:

- Launch all AI agents (Diagnosis Agent & Recommendation Agent).
- Start the Elasticsearch server used for medicine search functionality.
---

## ICP Features Used  

### Internet Identity (ICP-native Authentication)

- **Self-sovereign login** via passkeys (WebAuthn, TPM-backed, biometric, or hardware keys)—no usernames/passwords needed.
- **Per-dapp pseudonymous identities**: each user-dapp pair gets a unique principal to preserve privacy.
- **Developer-friendly integration**: use `@dfinity/auth-client` + `whoami()` Motoko query for smooth identity flow.
- **Secure and time-limited delegations**: handle sessions robustly without excessive user friction.

---

## Fetch.ai Features Used  

- **uAgents Library** ⚙️  
  - Enables building AI-driven agents with communication capabilities.  
  - Used for the Diagnosis Agent and Recommendation Agent.  

- **ASI:One Deployment** 🌐  
  - Used to **serve AI models on the internet**, making them accessible to the internet without directly using them from the application **DiagnoAI**


---

## Challenges Faced During the Hackathon 🚧  

- **AI Testing Limitations:** Due to restrictions and quota limits on the Gemini API key, testing and validating the AI agents in real scenarios was challenging.  
- **Hardware Constraints:** Handling large datasets caused significant performance issues on our development machines, resulting in lags and slower iteration cycles.  
- **Steep Learning Curve:** The project required adopting multiple new technologies and libraries (ICP, Fetch.ai, Elasticsearch, etc.), which increased development time as the team had to learn and experiment on the fly.  

---

## 🚀 Closing
**DiagnoAI** is more than just an app—it’s a **healthcare ecosystem** that empowers people with knowledge, guidance, and access.  
Together, we can **bridge the gap between diagnosis, treatment, and medicine availability**.  

---

## 🔗 Important Links

#### Pitch Deck Video Link
    https://dummylink

#### Website Documentation
    https://dummylink

#### Demo Video
    https://dummylink