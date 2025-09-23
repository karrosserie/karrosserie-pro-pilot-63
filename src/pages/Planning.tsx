import CarrosseriePlanning from '@/components/planning/CarrosseriePlanning';
import { TestWebhookButton } from '@/components/test-webhook-button';

const Index = () => {
  return (
    <div>
      <div className="p-4">
        <TestWebhookButton />
      </div>
      <CarrosseriePlanning />
    </div>
  );
};

export default Index;
