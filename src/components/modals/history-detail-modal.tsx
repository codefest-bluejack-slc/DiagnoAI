
import React from 'react';
import { createPortal } from 'react-dom';
import {
    Calendar,
    FileText,
    Pill,
    Stethoscope,
    User,
    X,
} from 'lucide-react';
import Tooltip from '../common/tooltip';
import { IHistoryResponse } from '../../interfaces/IHistoryModal';
import Markdown from 'react-markdown';

interface HistoryDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: IHistoryResponse | null;
}

const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ isOpen, onClose, item }) => {
    if (!isOpen || !item) return null;

    const handleOverlayClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] transition-all duration-200 opacity-100"
            onClick={handleOverlayClick}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-purple-950/80 to-indigo-950/80 backdrop-blur-md"></div>

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div
                    className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900/95 backdrop-blur-lg rounded-lg border border-purple-500/30 shadow-2xl transform transition-all duration-300 scale-100 opacity-100 translate-y-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-slate-800/90 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 p-2.5 rounded-lg bg-purple-400/40 text-purple-200">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-purple-100">
                                    Assessment Detail
                                </h2>
                                <p className="text-sm text-purple-300">
                                    ID: {item.id.slice(0, 8)}... | User: {item.username}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full transition-all duration-300 hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-slate-800/80 border border-purple-500/30 text-purple-200"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="p-2">
                            <h3 className="font-semibold text-lg mb-2 text-purple-100">
                                {item.title ? <Markdown>{item.title}</Markdown> : `Assessment ${item.id.slice(0, 8)}...`}
                            </h3>
                            <div className="flex items-center gap-4 text-sm mb-3">
                                <div className="flex items-center gap-1 text-purple-300">
                                    <Calendar className="w-4 h-4" />
                                    <span>ID: {item.id}</span>
                                </div>
                            </div>
                        </div>

                        {item.diagnosis && (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-medium text-purple-300">
                                        AI Diagnosis Result:
                                    </span>
                                </div>
                                <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-3">
                                    <p className="text-sm text-emerald-200 leading-relaxed">
                                        <Markdown>
                                            {item.diagnosis}
                                        </Markdown>
                                    </p>
                                </div>
                            </div>
                        )}

                        {!item.diagnosis && (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium text-purple-300">
                                        Diagnosis Status:
                                    </span>
                                </div>
                                <div className="bg-gray-500/10 border border-gray-400/30 rounded-lg p-3">
                                    <p className="text-sm text-gray-300">
                                        No diagnosis available for this assessment
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Stethoscope className="w-4 h-4 text-indigo-400" />
                                <span className="text-sm font-medium text-purple-300">
                                    Symptoms ({item.symptoms.length}):
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {item.symptoms.map((symptom, idx) => (
                                    <Tooltip
                                        key={idx}
                                        content={`Symptom: ${symptom.name} - Severity: ${symptom.severity}`}
                                        position="top"
                                    >
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full cursor-help transition-all duration-200 hover:scale-105 ${symptom.severity === 'mild'
                                                ? 'bg-green-500/20 text-green-300 border border-green-400/50'
                                                : symptom.severity === 'moderate'
                                                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/50'
                                                    : 'bg-red-500/20 text-red-300 border border-red-400/50'
                                                }`}
                                        >
                                            {symptom.name}
                                        </span>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>

                        {item.medicines.length > 0 ? (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Pill className="w-4 h-4 text-cyan-400" />
                                    <span className="text-sm font-medium text-purple-300">
                                        Recommended Medicines ({item.medicines.length}):
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {item.medicines.map((medicine, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-cyan-200 mb-1">
                                                        {medicine.brand_name}
                                                    </h4>
                                                    <p className="text-xs text-cyan-300/80 mb-1">
                                                        Generic: {medicine.generic_name}
                                                    </p>
                                                    <p className="text-xs text-cyan-300/60">
                                                        Manufacturer: {medicine.manufacturer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Pill className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium text-purple-300">
                                        Medicine Recommendations:
                                    </span>
                                </div>
                                <div className="bg-gray-500/10 border border-gray-400/30 rounded-lg p-3">
                                    <p className="text-sm text-gray-300">
                                        No medicine recommendations available for this assessment
                                    </p>
                                </div>
                            </div>
                        )}

                        {item.medicine_response ? (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-orange-400" />
                                    <span className="text-sm font-medium text-purple-300">
                                        AI Medicine Analysis:
                                    </span>
                                </div>
                                <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-3">
                                    <p className="text-sm text-orange-200 leading-relaxed">
                                        {item.medicine_response.length > 300
                                            ? `${item.medicine_response.slice(0, 300)}...`
                                            : item.medicine_response}
                                    </p>
                                    {item.medicine_response.length > 300 && (
                                        <button className="text-xs text-orange-300 hover:text-orange-200 mt-2 underline">
                                            Show full response
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium text-purple-300">
                                        Medicine Analysis:
                                    </span>
                                </div>
                                <div className="bg-gray-500/10 border border-gray-400/30 rounded-lg p-3">
                                    <p className="text-sm text-gray-300">
                                        No AI medicine analysis available for this assessment
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                    <span className="text-xs text-purple-300">
                                        {item.symptoms.length} symptoms
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                                    <span className="text-xs text-purple-300">
                                        {item.medicines.length} medicines
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                    <span className="text-xs text-purple-300">
                                        {item.diagnosis ? 'diagnosed' : 'pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default HistoryDetailModal;
