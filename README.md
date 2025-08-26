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
   - Provides a probable **diagnosis** with struct**u**red output.  

2. **Recommendation Agent** 💊  
   - Suggests **relevant medicines** based on the diagnosis.  
   - Provides **guidelines on safe usage** for each medicine.  

3. **History Agent** 📜
   - Provides previous **health assessments** based on a given username.
   - Gives a brief summary on the user's **health condition**

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

In DiagnoAI, the Internet Computer Protocol (ICP) is used as the backbone for decentralized backend services.  

- **Motoko Smart Contracts (Canisters):**  
  The backend is implemented using Motoko to build canisters (smart contracts) that handle core application logic and state management.  

- **Internet Identity for Authentication:**  
  Users authenticate securely via Internet Identity, ensuring decentralized and privacy-preserving login without usernames or passwords.  

- **HTTP Calls to Canisters:**  
  The frontend communicates with the backend canisters using ICP’s HTTP call mechanism, enabling smooth interaction between the user interface and the blockchain backend.  

- **Integration with Fetch.ai (History Agent):**  
  The history agent uses Fetch.ai to log and manage user prompts. The agent communicates with Motoko canisters to store and retrieve the history of prompts for a given username. This ensures that every user’s interaction history is preserved and accessible.  

- **Chat Protocol Support:**  
  The agents leverage Fetch.ai’s chat protocol to enable structured communication between the frontend, ICP backend, and the AI agents.  


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

* [Demo Video](https://youtu.be/hjOji8diK1A)
* [Website Documentation](https://nielxfb.notion.site/DiagnoAI-2574c303a60580919e92f1c6ddcb2705)
* [Pitch Deck](#)
