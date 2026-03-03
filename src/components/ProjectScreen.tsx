import { motion, useReducedMotion } from "framer-motion";
import type { ProjetoId } from "../types";

type ProjectScreenProps = {
  projeto: ProjetoId;
  onBack: () => void;
};

type ProjectInfo = {
  title: string;
  subtitle?: string;
  description: string;
  features: { title: string; description: string }[];
  stack: string;
  projectType: string;
  githubUrl?: string;
};

const PROJECTS: Record<ProjetoId, ProjectInfo> = {
  "projeto-1": {
    title: "Relatório ALV Interativo para Gerenciamento de Voos",
    subtitle:
      "Relatório ALV em SAP ABAP com foco em usabilidade e interação em tempo real",
    description:
      "Este projeto é um relatório ALV que utiliza programação orientada a objetos para criar uma experiência de usuário interativa. A aplicação exibe dados de voos e permite sua manipulação em tempo real, focando em usabilidade e eficiência.",
    features: [
      {
        title: "ALV Grid Principal",
        description:
          "Utilização do CL_GUI_ALV_GRID para exibir um grid principal com dados consolidados de voos, combinando informações de múltiplas tabelas.",
      },
      {
        title: "Feedback Visual (Semáforo de Ocupação)",
        description:
          "Ícone de status baseado na taxa de ocupação das poltronas: verde (≥ 95%), amarelo (entre 90% e 95%) e vermelho (< 90%). Isso facilita a leitura rápida da situação de cada voo.",
      },
      {
        title: "Popup Interativo com Segundo ALV",
        description:
          "Ao selecionar um voo, é aberto um popup com um segundo ALV exibindo as refeições disponíveis para a companhia aérea selecionada.",
      },
      {
        title: "Gerenciamento de Eventos OO",
        description:
          "Uso de classes locais e handlers de eventos para capturar ações do usuário, como cliques em botões e duplo clique nas linhas do ALV.",
      },
      {
        title: "Atualização em Tempo Real",
        description:
          "Após a seleção no popup, o ALV principal é atualizado dinamicamente com as novas informações, sem necessidade de recarregar o relatório por completo.",
      },
    ],
    stack: "SAP ABAP · CL_GUI_ALV_GRID · Programação Orientada a Objetos",
    projectType: "Relatório interativo interno para gerenciamento de voos",
  },

  "projeto-2": {
    title: "Previsão de Demanda Logística para Operador 3PL (DataLog)",
    subtitle:
      "Modelo de Regressão Linear para prever pedidos diários e evitar rupturas de estoque",
    description:
      "O projeto simula o ambiente da DataLog, um operador logístico 3PL que atende grandes varejistas, indústrias e e-commerces no Brasil. O objetivo é prever a quantidade de pedidos atendidos por dia, reduzindo falhas de atendimento, rupturas de estoque e custos operacionais, principalmente em períodos de alta demanda (como Black Friday e Natal). Para isso, foi desenvolvida uma pipeline completa em Python, desde a preparação dos dados até a avaliação de um modelo de Regressão Linear.",
    features: [
      {
        title: "Objetivo de Negócio",
        description:
          "Prever a quantidade diária de pedidos atendidos pela operação logística, identificar fatores que influenciam a demanda (estoque, promoções, sazonalidade, custos) e antecipar cenários de estoque zerado para apoiar o planejamento de estoque e recursos.",
      },
      {
        title: "Coleta e Preparação dos Dados",
        description:
          "Uso de um dataset CSV com dados sintéticos gerados por IA, representando o histórico da DataLog de 2010 a 2024. Leitura com pandas, inspeção de tipos, verificação de consistência e checagem de valores ausentes para garantir a qualidade da base.",
      },
      {
        title: "Análise Exploratória (EDA)",
        description:
          "Exploração de variáveis-chave (Estoque_Inicial, Estoque_Final, Pedidos_Recebidos, Lead_Time, Custo_Estoque) com boxplots e histogramas, identificação de outliers com Z-score e IQR e análise do impacto de eventos promocionais (Black Friday, Natal, Dia das Mães, etc.) na demanda.",
      },
      {
        title: "Engenharia de Atributos e Pré-processamento",
        description:
          "Aplicação de One-Hot-Encoding para variáveis categóricas (Centros de Distribuição, SKUs, tipos de eventos promocionais), criação de flags como Estoque_Zerado e Tem_Custo_Estoque, transformação logarítmica (log1p) em Estoque_Final e Custo_Estoque, extração de dia/mês/ano da data e normalização de variáveis contínuas com StandardScaler.",
      },
      {
        title: "Seleção de Variáveis e Correlação",
        description:
          "Cálculo da matriz de correlação para reduzir multicolinearidade, removendo variáveis com correlação absoluta acima de 0,7.",
      },
      {
        title: "Modelagem Preditiva e Validação",
        description:
          "Divisão treino/teste (80% / 20%) e treinamento de um modelo de Regressão Linear usando scikit-learn. Avaliação com validação cruzada K-Fold (k=5).",
      },
      {
        title: "Insights de Negócio",
        description:
          "Eventos promocionais elevam significativamente o volume de pedidos. Foram identificados momentos de estoque zerado, evidenciando perda de vendas.",
      },
      {
        title: "Resultados do Modelo",
        description:
          "O modelo alcançou R² = 0,911, explicando cerca de 91% da variância dos dados.",
      },
      {
        title: "Aplicações na Operação",
        description:
          "Possibilita criar alertas preditivos de ruptura de estoque, planejar antecipadamente datas promocionais e alimentar dashboards gerenciais.",
      },
    ],
    stack:
      "Python · pandas · numpy · scipy · scikit-learn · matplotlib · seaborn",
    projectType: "Modelo de machine learning para previsão de demanda",
    githubUrl:
      "https://github.com/Breno-Aliotti/Projeto-Dados-Previs-o-de-Demanda-e-Otimiza-o-Log-stica/blob/main/Projetodados.py/projeto.py/dadosfinal.py/projeto.ipynb",
  },
};

type ProjectImage = {
  title: string;
  src: string;
  alt: string;
  heightClass: string;
};

export default function ProjectScreen({ projeto, onBack }: ProjectScreenProps) {
  const project = PROJECTS[projeto];
  const base = import.meta.env.BASE_URL ?? "/";
  const shouldReduceMotion = useReducedMotion();

  const images: ProjectImage[] =
    projeto === "projeto-1"
      ? [
          {
            title: "Tela de seleção de companhia aérea",
            src: "tela-selecao-companhia.png",
            alt: "Tela de seleção de companhia aérea",
            heightClass: "h-[420px] md:h-[520px]",
          },
          {
            title: "Tela ALV após seleção de companhia",
            src: "tela-alv-apos-selecao-companhia.png",
            alt: "Tela ALV após seleção de companhia",
            heightClass: "h-[320px] md:h-[380px]",
          },
          {
            title: "Tela de seleção de refeição",
            src: "tela-selecao-refeicao.png",
            alt: "Tela de seleção de refeição",
            heightClass: "h-[320px] md:h-[380px]",
          },
          {
            title: "ALV com refeições adicionadas",
            src: "alv-refeicoes-adicionadas.png",
            alt: "ALV com refeições adicionadas",
            heightClass: "h-[320px] md:h-[380px]",
          },
        ]
      : [];

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.35 }}
      className="min-h-screen text-zinc-100"
    >
      <main className="max-w-5xl mx-auto px-6 py-10 md:py-14">
        {/* Voltar */}
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md px-2 py-1"
        >
          <span className="text-lg">←</span>
          <span>Voltar</span>
        </button>

        {/* Cabeçalho */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-zinc-50">
            {project.title}
          </h1>

          {project.subtitle && (
            <p className="mt-2 text-sm text-zinc-400">{project.subtitle}</p>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs md:text-sm text-zinc-300 hover:text-zinc-100 underline decoration-white/20 decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-sm"
            >
              Link para o projeto no GitHub
            </a>
          )}
        </header>

        {/* TEXTOS */}
        <section>
          <p className="text-sm md:text-base text-zinc-200 leading-relaxed mb-8">
            {project.description}
          </p>

          <h2 className="text-xs font-semibold text-zinc-300 mb-4 uppercase tracking-[0.22em]">
            Funcionalidades implementadas
          </h2>

          <ul className="space-y-4 text-sm text-zinc-300">
            {project.features.map((feature) => (
              <li key={feature.title} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/60 flex-shrink-0" />
                <div>
                  <p className="font-medium text-zinc-100">{feature.title}</p>
                  <p className="text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-sm text-zinc-400">
            <p>
              <span className="text-zinc-300">Stack:</span> {project.stack}
            </p>
            <p className="mt-1">
              <span className="text-zinc-300">Tipo:</span> {project.projectType}
            </p>
          </div>
        </section>

        {/* IMAGENS (tamanho normal como antes) */}
        {images.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xs font-semibold text-zinc-300 mb-5 uppercase tracking-[0.22em]">
              Imagens
            </h2>

            <div className="space-y-8">
              {images.map((img) => {
                const href = `${base}${img.src}`;

                return (
                  <div key={img.src}>
                    <p className="text-sm font-medium text-zinc-300 mb-2">
                      {img.title}
                    </p>

                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className={[
                        "block rounded-2xl border border-white/10 bg-black/40 overflow-hidden",
                        "transition-colors hover:border-white/20",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                      ].join(" ")}
                      title="Clique para abrir em tamanho maior"
                    >
                      <div
                        className={[
                          "w-full",
                          img.heightClass,
                          "p-3 md:p-4 flex items-center justify-center",
                        ].join(" ")}
                      >
                        <img
                          src={href}
                          alt={img.alt}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </motion.div>
  );
}