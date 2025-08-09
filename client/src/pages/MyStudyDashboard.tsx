import StudySubmissionSystem from '@/components/StudySubmissionSystem';

export default function MyStudyDashboard() {
  // For now, using a hardcoded user ID. In real implementation, this would come from auth context
  const userId = "user-1";

  return <StudySubmissionSystem userId={userId} />;
}