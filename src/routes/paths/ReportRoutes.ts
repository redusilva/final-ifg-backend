import express from 'express';
import { reportController } from '../../container/ReportContainer';
import { validateMongoIdParams } from '../../middlewares/validateMongoIdParams';

const router = express.Router();

/**
 * @swagger
 * /report/discipline/{id}:
 *   get:
 *     summary: Gera um relatório completo de uma disciplina.
 *     description: Retorna dados detalhados de presença e progresso da turma.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina para gerar o relatório
 *     responses:
 *       200:
 *         description: Relatório da disciplina retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       404:
 *         description: Disciplina não encontrada.
 */
router.get(
    '/discipline/:id',
    validateMongoIdParams,
    async (req, res) => {
        await reportController.getDisciplineReport(req, res);
    }
);

export default router;
