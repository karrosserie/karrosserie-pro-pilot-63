import CarrosseriePlanning from '@/components/planning/CarrosseriePlanning';
import { TestWebhookButton } from '@/components/test-webhook-button';

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="p-2 sm:p-4">
        <TestWebhookButton />
      </div>
      <div className="px-2 sm:px-4">
        <CarrosseriePlanning />
      </div>
    </div>
  );
};

export default Index;
