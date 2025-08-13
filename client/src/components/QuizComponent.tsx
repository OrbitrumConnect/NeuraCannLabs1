import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Award, RefreshCw, MessageCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import DraCannabisAI from "./DraCannabisAI";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: { questionId: string; selectedAnswer: number; correct: boolean }[];
}

interface QuizComponentProps {
  quizId: string;
  moduleId: string;
  title: string;
  description: string;
  passingScore: number;
  timeLimit?: number;
  maxAttempts?: number;
  onComplete?: (result: QuizAttempt) => void;
}

export default function QuizComponent({
  quizId,
  moduleId,
  title,
  description,
  passingScore,
  timeLimit = 600, // 10 minutos default
  maxAttempts = 3,
  onComplete
}: QuizComponentProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: number}>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizAttempt | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showDraCannabis, setShowDraCannabis] = useState(false);

  // Mock questions - em produção viriam da API
  const questions: Question[] = [
    {
      id: "q1",
      question: "Qual é o principal componente psicoativo da Cannabis?",
      options: ["CBD", "THC", "CBG", "CBN"],
      correctAnswer: 1,
      explanation: "O THC (Tetraidrocanabinol) é o principal componente psicoativo da cannabis, responsável pelos efeitos psicológicos.",
      difficulty: 'easy'
    },
    {
      id: "q2", 
      question: "Em que dosagem inicial é recomendada para pacientes iniciantes com CBD?",
      options: ["1-2mg", "5-10mg", "20-25mg", "50-100mg"],
      correctAnswer: 1,
      explanation: "A dosagem inicial recomendada para CBD em pacientes iniciantes é de 5-10mg, aumentando gradualmente conforme necessário.",
      difficulty: 'medium'
    },
    {
      id: "q3",
      question: "Qual via de administração tem início de ação mais rápido?",
      options: ["Oral (óleo)", "Sublingual", "Inalação (vaporização)", "Tópica"],
      correctAnswer: 2,
      explanation: "A inalação por vaporização tem o início de ação mais rápido (2-15 minutos), seguida pela via sublingual.",
      difficulty: 'medium'
    }
  ];

  // Mutation para submeter quiz
  const submitQuizMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/education/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    },
    onSuccess: (result: QuizAttempt) => {
      setQuizResult(result);
      setShowResults(true);
      onComplete?.(result);
    }
  });

  const startQuiz = () => {
    setIsStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeRemaining(timeLimit);
    
    // Timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const selectAnswer = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questions[questionIndex].id]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const answers = questions.map(q => ({
      questionId: q.id,
      selectedAnswer: selectedAnswers[q.id] ?? -1,
      correct: selectedAnswers[q.id] === q.correctAnswer
    }));

    const correctCount = answers.filter(a => a.correct).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const timeSpent = timeLimit - timeRemaining;

    const attempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      quizId,
      score,
      totalQuestions: questions.length,
      timeSpent,
      answers
    };

    submitQuizMutation.mutate({
      moduleId,
      attempt,
      answers: selectedAnswers
    });
  };

  const restartQuiz = () => {
    setIsStarted(false);
    setShowResults(false);
    setQuizResult(null);
    setShowFeedback(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz não iniciado
  if (!isStarted && !showResults) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            {title}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-slate-300">
              <Clock className="w-4 h-4 inline mr-1" />
              Tempo: {formatTime(timeLimit)}
            </div>
            <div className="text-slate-300">
              Questões: {questions.length}
            </div>
            <div className="text-slate-300">
              Nota mínima: {passingScore}%
            </div>
            <div className="text-slate-300">
              Tentativas: {maxAttempts}
            </div>
          </div>

          <Button 
            onClick={startQuiz} 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            data-testid="button-start-quiz"
          >
            Iniciar Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Quiz em andamento
  if (isStarted && !showResults) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="space-y-4">
        {/* Header com progresso */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-300">
                Questão {currentQuestionIndex + 1} de {questions.length}
              </span>
              <div className="flex items-center gap-4">
                <Badge variant={timeRemaining < 60 ? "destructive" : "outline"}>
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(timeRemaining)}
                </Badge>
                <Badge 
                  variant={currentQuestion.difficulty === 'hard' ? 'destructive' : 
                           currentQuestion.difficulty === 'medium' ? 'default' : 'secondary'}
                >
                  {currentQuestion.difficulty}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Questão atual */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswers[currentQuestion.id] === index ? "default" : "outline"}
                className={`w-full text-left justify-start h-auto p-4 ${
                  selectedAnswers[currentQuestion.id] === index 
                    ? "bg-emerald-600 border-emerald-500" 
                    : "border-slate-600 hover:border-slate-500"
                }`}
                onClick={() => selectAnswer(currentQuestionIndex, index)}
                data-testid={`option-${index}`}
              >
                <span className="mr-3 font-bold">{String.fromCharCode(65 + index)})</span>
                {option}
              </Button>
            ))}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                data-testid="button-previous"
              >
                Anterior
              </Button>
              
              <Button
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestion.id] === undefined}
                className="bg-emerald-600 hover:bg-emerald-700"
                data-testid="button-next"
              >
                {currentQuestionIndex === questions.length - 1 ? "Finalizar" : "Próxima"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Resultados
  if (showResults && quizResult) {
    const passed = quizResult.score >= passingScore;
    
    return (
      <div className="space-y-4">
        {/* Resultado principal */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {passed ? (
                <CheckCircle className="w-16 h-16 text-green-500" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500" />
              )}
            </div>
            <CardTitle className={`text-2xl ${passed ? 'text-green-400' : 'text-red-400'}`}>
              {passed ? 'Parabéns! Você passou!' : 'Não foi dessa vez...'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Sua pontuação: {quizResult.score}% (mínimo: {passingScore}%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-white">{quizResult.score}%</div>
                <div className="text-sm text-slate-400">Pontuação</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-white">{formatTime(quizResult.timeSpent)}</div>
                <div className="text-sm text-slate-400">Tempo gasto</div>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => setShowFeedback(!showFeedback)}
                variant="outline"
                data-testid="button-show-feedback"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ver Feedback
              </Button>
              
              <Button
                onClick={() => setShowDraCannabis(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
                data-testid="button-ask-dra-cannabis"
              >
                Perguntar à Dra. Cannabis
              </Button>
              
              {!passed && (
                <Button
                  onClick={restartQuiz}
                  className="bg-blue-600 hover:bg-blue-700"
                  data-testid="button-retry-quiz"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feedback detalhado */}
        {showFeedback && (
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Feedback Detalhado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = quizResult.answers.find(a => a.questionId === question.id);
                const correct = userAnswer?.correct ?? false;
                
                return (
                  <div key={question.id} className="border-l-4 border-slate-700 pl-4 py-2">
                    <div className="flex items-start gap-2">
                      {correct ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-white font-medium">{question.question}</p>
                        <p className="text-sm text-slate-400 mt-1">
                          {question.explanation}
                        </p>
                        {!correct && (
                          <p className="text-sm text-emerald-400 mt-1">
                            Resposta correta: {question.options[question.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Dra. Cannabis IA */}
        {showDraCannabis && (
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-400 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Consulte a Dra. Cannabis IA
              </CardTitle>
              <CardDescription className="text-slate-400">
                Tire suas dúvidas sobre as questões do quiz com nossa IA especializada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DraCannabisAI />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return null;
}