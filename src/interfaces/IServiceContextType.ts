import { HistoryService } from "../services/history.service";
import { SymptompService } from "../services/symptomp.service";
import { UserService } from "../services/user.service";

export interface IServiceContextType {
    userService : UserService
    historyService : HistoryService
    symptompService : SymptompService
}