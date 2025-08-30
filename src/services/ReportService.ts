import { IAttendance } from '../intefaces/entities/Attendance';
import { IDiscipline } from '../intefaces/entities/Discipline';
import { IUser } from '../intefaces/entities/User';
import { IDisciplineDetailedReport, IStudentReport } from '../intefaces/entities/Report';
import { DisciplineModel } from '../models/DisciplineMongooseModel';
import { UserModel } from '../models/UserMongooseModel';
import { AttendanceModel } from '../models/AttendanceMongooseModel';
import { Model } from 'mongoose';

interface ReportServiceProps {
    disciplineModel: Model<IDiscipline>;
    userModel: Model<IUser>;
    attendanceModel: Model<IAttendance>;
}

export class ReportService {
    private readonly disciplineModel: Model<IDiscipline>;
    private readonly userModel: Model<IUser>;
    private readonly attendanceModel: Model<IAttendance>;

    constructor(data: ReportServiceProps) {
        this.disciplineModel = data.disciplineModel;
        this.userModel = data.userModel;
        this.attendanceModel = data.attendanceModel;
    }

    public async getDisciplineReport(disciplineId: string): Promise<IDisciplineDetailedReport> {
        const discipline = await this.disciplineModel.findById(disciplineId).lean<IDiscipline>();
        if (!discipline) {
            throw new Error('Disciplina não encontrada.');
        }

        const students = await this.userModel.find({
            _id: { $in: discipline.students }
        }).lean<IUser[]>();

        const allAttendance = await this.attendanceModel.find({ disciplineId }).lean<IAttendance[]>();

        const studentAttendance: IAttendance[] = allAttendance.filter(a => a.studentId);
        const teacherAttendance: IAttendance[] = allAttendance.filter(a => a.teacherId);

        const classesTaught: number = teacherAttendance.filter(a => a.status === 'PRESENT').length;

        const studentsReport: IStudentReport[] = students.map((student: IUser) => {
            const studentIdStr: string = student.id?.toString() || '';
            const attendanceData: IAttendance[] = studentAttendance.filter(a => a.studentId?.toString() === studentIdStr);

            const presentCount: number = attendanceData.filter(a => a.status === 'PRESENT').length;
            const absentCount: number = attendanceData.filter(a => a.status === 'ABSENT').length;

            const presencePercentage: number = classesTaught > 0 ? (presentCount / classesTaught) * 100 : 0;
            const status: 'at_risk' | 'normal' = (presencePercentage < 75) ? 'at_risk' : 'normal';

            return {
                name: student.name,
                quantidade_faltas: absentCount,
                porcentagem_presenca: presencePercentage.toFixed(2),
                status_aluno: status,
            };
        });

        const totalStudents: number = students.length;
        const totalAulasCanceladas: number = teacherAttendance.filter(a => a.status === 'ABSENT').length;
        
        const totalAulasRestantes: number = (discipline.total_classes ?? 0) - classesTaught - totalAulasCanceladas;

        const alunosNormalCount: number = studentsReport.filter(s => s.status_aluno === 'normal').length;
        const alunosRiscoCount: number = studentsReport.filter(s => s.status_aluno === 'at_risk').length;

        const mediaPresencaDisciplina: number = totalStudents > 0
            ? studentsReport.reduce((sum, s) => sum + parseFloat(s.porcentagem_presenca), 0) / totalStudents
            : 0;
        
        const classPercentages = {
            ministradas: (classesTaught / (discipline.total_classes ?? 1)) * 100,
            canceladas: (totalAulasCanceladas / (discipline.total_classes ?? 1)) * 100,
            restantes: (totalAulasRestantes / (discipline.total_classes ?? 1)) * 100
        };

        const finalReport: IDisciplineDetailedReport = {
            disciplina_nome: discipline.name,
            total_alunos: totalStudents,
            tabela_alunos: studentsReport,
            graficos_gerais: {
                total_aulas_ministradas_num: classesTaught,
                total_aulas_ministradas_pct: classPercentages.ministradas.toFixed(2),
                presenca_media: mediaPresencaDisciplina.toFixed(2),
                alunos_por_status: {
                    normal: alunosNormalCount,
                    risco: alunosRiscoCount,
                    normal_pct: (alunosNormalCount / totalStudents) * 100,
                    risco_pct: (alunosRiscoCount / totalStudents) * 100,
                },
                aulas_status: {
                    ministradas_num: classesTaught,
                    canceladas_num: totalAulasCanceladas,
                    restantes_num: totalAulasRestantes,
                    ministradas_pct: classPercentages.ministradas.toFixed(2),
                    canceladas_pct: classPercentages.canceladas.toFixed(2),
                    restantes_pct: classPercentages.restantes.toFixed(2),
                }
            }
        };

        return finalReport;
    }
}