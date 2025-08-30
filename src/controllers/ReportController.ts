import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { ReportService } from '../services/ReportService';

interface ReportControllerProps {
    reportService: ReportService;
}

export class ReportController {
    private reportService: ReportService;

    constructor(data: ReportControllerProps) {
        this.reportService = data.reportService;
    }

    public async getDisciplineReport(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            if (!Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID da disciplina inválido.' });
            }

            const report = await this.reportService.getDisciplineReport(id);
            return res.status(200).json(report);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'ID da disciplina inválido.' || error.message === 'Disciplina não encontrada.') {
                    return res.status(404).json({ message: error.message });
                }
            }
            console.error('Erro ao gerar relatório:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}