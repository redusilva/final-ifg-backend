
import { IAttendance } from './Attendance';
import { IUser } from './User';
import { IDiscipline } from './Discipline';

export interface IStudentReport {
    name: string;
    quantidade_faltas: number;
    porcentagem_presenca: string;
    status_aluno: 'at_risk' | 'normal';
}

export interface IDisciplineDetailedReport {
    disciplina_nome: string;
    total_alunos: number;
    tabela_alunos: IStudentReport[];
    graficos_gerais: {
        total_aulas_ministradas_num: number;
        total_aulas_ministradas_pct: string;
        presenca_media: string;
        alunos_por_status: {
            normal: number;
            risco: number;
            normal_pct: number;
            risco_pct: number;
        };
        aulas_status: {
            ministradas_num: number;
            canceladas_num: number;
            restantes_num: number;
            ministradas_pct: string;
            canceladas_pct: string;
            restantes_pct: string;
        };
    };
}