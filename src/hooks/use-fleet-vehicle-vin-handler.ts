
import { isValidVin, decodeVin } from '@/services/vin-decoder';
import { useCarBrands } from '@/hooks/use-car-brands';

interface VinHandlerProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function useFleetVehicleVinHandler({ formData, setFormData }: VinHandlerProps) {
  const { carBrands } = useCarBrands();

  const handleVinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'vin') {
      const upperValue = value.toUpperCase();
      setFormData(prev => ({ ...prev, vin: upperValue }));
      
      // Auto-decode VIN if valid
      if (isValidVin(upperValue)) {
        const vinInfo = decodeVin(upperValue);
        console.log('VIN décodé:', vinInfo);
        
        if (vinInfo.brand && carBrands.length > 0) {
          const matchingBrand = carBrands.find(brand => 
            brand.name.toLowerCase() === vinInfo.brand?.toLowerCase()
          );
          
          if (matchingBrand) {
            console.log('Marque détectée par VIN:', matchingBrand.name);
            setFormData(prev => ({
              ...prev,
              brand_id: matchingBrand.id,
              year: vinInfo.year || prev.year
            }));
          }
        }
      }
    }
  };

  return {
    handleVinInputChange
  };
}
