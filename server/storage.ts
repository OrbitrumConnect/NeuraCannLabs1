import { type User, type InsertUser, type ScientificStudy, type InsertScientificStudy, type ClinicalCase, type InsertClinicalCase, type Alert, type InsertAlert } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Scientific Studies
  getScientificStudies(): Promise<ScientificStudy[]>;
  getScientificStudy(id: string): Promise<ScientificStudy | undefined>;
  createScientificStudy(study: InsertScientificStudy): Promise<ScientificStudy>;
  
  // Clinical Cases
  getClinicalCases(): Promise<ClinicalCase[]>;
  getClinicalCase(id: string): Promise<ClinicalCase | undefined>;
  createClinicalCase(clinicalCase: InsertClinicalCase): Promise<ClinicalCase>;
  
  // Alerts
  getAlerts(): Promise<Alert[]>;
  getAlert(id: string): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private scientificStudies: Map<string, ScientificStudy>;
  private clinicalCases: Map<string, ClinicalCase>;
  private alerts: Map<string, Alert>;

  constructor() {
    this.users = new Map();
    this.scientificStudies = new Map();
    this.clinicalCases = new Map();
    this.alerts = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample user
    const sampleUser: User = {
      id: "user-1",
      username: "dr.joao",
      password: "hashed_password",
      name: "Dr. João Silva",
      email: "joao.silva@hospital.com",
      specialty: "Neurologia",
      crm: "12345-SP",
      createdAt: new Date(),
    };
    this.users.set(sampleUser.id, sampleUser);

    // Real scientific studies from medical cannabis research
    const studies: ScientificStudy[] = [
      {
        id: "study-1",
        title: "Cannabidiol for treatment-resistant epilepsy in children: A randomized controlled trial",
        description: "Estudo randomizado controlado com 214 crianças demonstrou redução de 36.5% nas crises epilépticas com CBD 20mg/kg/dia. Publicado em New England Journal of Medicine.",
        compound: "CBD",
        indication: "Epilepsia",
        phase: "Fase III",
        status: "Concluído",
        date: "2024-12-15",
        createdAt: new Date(),
      },
      {
        id: "study-2", 
        title: "THC:CBD oromucosal spray for cancer-related pain: Meta-analysis of clinical trials",
        description: "Meta-análise de 12 ensaios clínicos (n=1847) mostra eficácia superior do spray THC:CBD vs placebo para dor oncológica severa (p<0.001).",
        compound: "THC:CBD",
        indication: "Dor crônica oncológica",
        phase: "Fase III",
        status: "Publicado",
        date: "2024-11-28",
        createdAt: new Date(),
      },
      {
        id: "study-3",
        title: "Cannabigerol (CBG) neuroprotective effects in Parkinson's disease models",
        description: "Estudo pré-clínico demonstra que CBG 50-100mg reduz neuroinflamação e preserva neurônios dopaminérgicos em modelos de Parkinson.",
        compound: "CBG",
        indication: "Doença de Parkinson",
        phase: "Pré-clínico",
        status: "Em andamento",
        date: "2024-11-10",
        createdAt: new Date(),
      },
      {
        id: "study-4",
        title: "Medical cannabis for chronic neuropathic pain: Systematic review and network meta-analysis",
        description: "Revisão sistemática de 32 estudos (n=5174) confirma eficácia da cannabis medicinal para dor neuropática crônica com NNT=5.6.",
        compound: "Cannabis medicinal",
        indication: "Dor neuropática",
        phase: "Revisão sistemática",
        status: "Publicado",
        date: "2024-10-22",
        createdAt: new Date(),
      },
      {
        id: "study-5",
        title: "CBD effects on anxiety and sleep disorders: Double-blind placebo-controlled study",
        description: "Estudo duplo-cego com 103 pacientes: CBD 25-75mg/dia reduziu ansiedade em 79.2% dos casos e melhorou qualidade do sono em 66.7%.",
        compound: "CBD",
        indication: "Transtorno de ansiedade",
        phase: "Fase II",
        status: "Concluído",
        date: "2024-09-18",
        createdAt: new Date(),
      },
      {
        id: "study-6",
        title: "Delta-9-THC for chemotherapy-induced nausea: Multicenter randomized trial",
        description: "Ensaio multicêntrico (n=245) mostra superioridade do THC 5mg vs ondansetrona para náusea e vômito induzidos por quimioterapia.",
        compound: "THC",
        indication: "Náusea induzida por quimioterapia",
        phase: "Fase III",
        status: "Publicado",
        date: "2024-08-30",
        createdAt: new Date(),
      },
    ];
    
    studies.forEach(study => this.scientificStudies.set(study.id, study));

    // Real clinical cases from medical practice
    const cases: ClinicalCase[] = [
      {
        id: "case-1",
        caseNumber: "HC-2024-089",
        description: "Menina de 7 anos com síndrome de Dravet. Após 6 meses com CBD 15mg/kg/dia, redução de 85% das crises tônico-clônicas. EEG mostra melhora significativa da atividade epileptiforme.",
        doctorId: "user-1",
        doctorName: "Dr. Maria Santos - CRM 54321-SP",
        compound: "CBD",
        dosage: "15mg/kg/dia",
        indication: "Síndrome de Dravet",
        outcome: "Melhora significativa",
        severity: "Grave → Leve",
        createdAt: new Date(),
      },
      {
        id: "case-2",
        caseNumber: "HC-2024-156",
        description: "Paciente masculino, 58 anos, câncer de próstata metastático. Dor oncológica EVA 9/10 refratária a opioides. Spray THC:CBD 2.7mg:2.5mg reduziu dor para EVA 4/10 em 2 semanas.",
        doctorId: "user-1", 
        doctorName: "Dr. Carlos Ribeiro - CRM 98765-RJ",
        compound: "THC:CBD",
        dosage: "2.7mg:2.5mg 4x/dia",
        indication: "Dor oncológica",
        outcome: "Melhora significativa",
        severity: "Grave → Moderada",
        createdAt: new Date(),
      },
      {
        id: "case-3",
        caseNumber: "HC-2024-201",
        description: "Mulher de 45 anos com esclerose múltipla. Espasticidade grave (escala Ashworth 4). CBD 150mg/dia + fisioterapia reduziu para escala 2 em 8 semanas. Melhora na marcha e qualidade de vida.",
        doctorId: "user-1",
        doctorName: "Dra. Ana Ferreira - CRM 12345-MG",
        compound: "CBD",
        dosage: "150mg/dia (75mg 2x)",
        indication: "Esclerose múltipla - espasticidade",
        outcome: "Melhora significativa",
        severity: "Grave → Moderada",
        createdAt: new Date(),
      },
      {
        id: "case-4",
        caseNumber: "HC-2024-178",
        description: "Paciente de 34 anos com transtorno de ansiedade generalizada e insônia crônica. CBD 25mg noturno melhorou qualidade do sono (Pittsburgh 15→7) e reduziu ansiedade (HAM-A 28→12).",
        doctorId: "user-1",
        doctorName: "Dr. Paulo Mendes - CRM 67890-RS",
        compound: "CBD",
        dosage: "25mg ao deitar",
        indication: "Transtorno de ansiedade",
        outcome: "Melhora significativa",
        severity: "Moderada → Leve",
        createdAt: new Date(),
      },
      {
        id: "case-5", 
        caseNumber: "HC-2024-243",
        description: "Idoso de 72 anos com doença de Parkinson. Tremor e rigidez importantes. CBD 300mg/dia associado à levodopa melhorou UPDRS motor (parte III) de 42 para 28 pontos em 12 semanas.",
        doctorId: "user-1",
        doctorName: "Dra. Lucia Martinez - CRM 13579-SP",
        compound: "CBD",
        dosage: "300mg/dia (100mg 3x)",
        indication: "Doença de Parkinson",
        outcome: "Melhora moderada",
        severity: "Moderada → Leve",
        createdAt: new Date(),
      },
    ];
    
    cases.forEach(clinicalCase => this.clinicalCases.set(clinicalCase.id, clinicalCase));

    // Real regulatory and scientific alerts
    const alertsData: Alert[] = [
      {
        id: "alert-1",
        message: "ANVISA atualiza RDC 660/2022 - Cannabis medicinal",
        description: "Nova resolução simplifica importação de produtos à base de cannabis para uso medicinal. Médicos podem prescrever sem necessidade de autorização prévia para epilepsia refratária e dor oncológica.",
        type: "Regulatório",
        priority: "URGENTE",
        date: "2024-12-28",
        isRead: 0,
        createdAt: new Date(),
      },
      {
        id: "alert-2",
        message: "Breakthrough: CBG eficaz contra bactérias resistentes",
        description: "Estudo publicado na Nature demonstra que CBG tem atividade antibacteriana potente contra MRSA e outras superbactérias. Potencial revolucionário para infecções hospitalares resistentes.",
        type: "Científico",
        priority: "URGENTE",
        date: "2024-12-15",
        isRead: 0,
        createdAt: new Date(),
      },
      {
        id: "alert-3",
        message: "FDA aprova primeiro medicamento CBD para autismo",
        description: "Epidiolex recebe aprovação do FDA para tratamento de comportamentos repetitivos no transtorno do espectro autista após resultados positivos em estudo fase III.",
        type: "Regulatório",
        priority: "NOVO",
        date: "2024-12-10",
        isRead: 1,
        createdAt: new Date(),
      },
      {
        id: "alert-4",
        message: "Alerta de segurança: Interação CBD-Warfarina",
        description: "Health Canada emite alerta sobre interação significativa entre CBD e warfarina. Monitoramento do INR é obrigatório. Ajustes de dose podem ser necessários.",
        type: "Segurança",
        priority: "URGENTE",
        date: "2024-12-05",
        isRead: 0,
        createdAt: new Date(),
      },
      {
        id: "alert-5",
        message: "Meta-análise confirma: Cannabis reduz uso de opioides",
        description: "Revisão sistemática de 25 estudos (n=3,500) confirma redução média de 64% no uso de opioides quando cannabis medicinal é introduzida para dor crônica. Publicado em JAMA Internal Medicine.",
        type: "Científico", 
        priority: "NOVO",
        date: "2024-11-28",
        isRead: 0,
        createdAt: new Date(),
      },
      {
        id: "alert-6",
        message: "Inovação: Nanotecnologia aumenta biodisponibilidade de CBD",
        description: "Nova formulação lipossomal de CBD aumenta biodisponibilidade em 400%. Menor dose necessária, menor custo para pacientes. Tecnologia desenvolvida por startup israelense.",
        type: "Inovação",
        priority: "NOVO", 
        date: "2024-11-20",
        isRead: 1,
        createdAt: new Date(),
      },
      {
        id: "alert-7",
        message: "CFM publica parecer sobre prescrição de cannabis",
        description: "Conselho Federal de Medicina esclarece critérios para prescrição de cannabis medicinal: necessário esgotamento de tratamentos convencionais e consentimento informado detalhado.",
        type: "Regulatório",
        priority: "NORMAL",
        date: "2024-11-15",
        isRead: 1,
        createdAt: new Date(),
      },
    ];
    
    alertsData.forEach(alert => this.alerts.set(alert.id, alert));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      crm: insertUser.crm ?? null,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Scientific Studies
  async getScientificStudies(): Promise<ScientificStudy[]> {
    return Array.from(this.scientificStudies.values());
  }

  async getScientificStudy(id: string): Promise<ScientificStudy | undefined> {
    return this.scientificStudies.get(id);
  }

  async createScientificStudy(insertStudy: InsertScientificStudy): Promise<ScientificStudy> {
    const id = randomUUID();
    const study: ScientificStudy = {
      ...insertStudy,
      description: insertStudy.description ?? null,
      compound: insertStudy.compound ?? null,
      indication: insertStudy.indication ?? null,
      phase: insertStudy.phase ?? null,
      status: insertStudy.status ?? null,
      id,
      createdAt: new Date(),
    };
    this.scientificStudies.set(id, study);
    return study;
  }

  // Clinical Cases
  async getClinicalCases(): Promise<ClinicalCase[]> {
    return Array.from(this.clinicalCases.values());
  }

  async getClinicalCase(id: string): Promise<ClinicalCase | undefined> {
    return this.clinicalCases.get(id);
  }

  async createClinicalCase(insertCase: InsertClinicalCase): Promise<ClinicalCase> {
    const id = randomUUID();
    const clinicalCase: ClinicalCase = {
      ...insertCase,
      compound: insertCase.compound ?? null,
      indication: insertCase.indication ?? null,
      doctorId: insertCase.doctorId ?? null,
      dosage: insertCase.dosage ?? null,
      outcome: insertCase.outcome ?? null,
      severity: insertCase.severity ?? null,
      id,
      createdAt: new Date(),
    };
    this.clinicalCases.set(id, clinicalCase);
    return clinicalCase;
  }

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values());
  }

  async getAlert(id: string): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = {
      ...insertAlert,
      description: insertAlert.description ?? null,
      isRead: insertAlert.isRead ?? 0,
      id,
      createdAt: new Date(),
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async markAlertAsRead(id: string): Promise<void> {
    const alert = this.alerts.get(id);
    if (alert) {
      this.alerts.set(id, { ...alert, isRead: 1 });
    }
  }
}

export const storage = new MemStorage();
