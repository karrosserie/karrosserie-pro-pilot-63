
import { useState, useEffect } from 'react';
import { isValidVin, decodeVin } from '@/services/vin-decoder';
import { useCarBrands } from '@/hooks/use-car-brands';
import { useCarModels } from '@/hooks/use-car-models';

export function useVinDecoder(initialFormData: any, onFormDataChange: (data: any) => void) {
  const { carBrands } = useCarBrands();
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const { carModels } = useCarModels(selectedBrandId);
  const [pendingVinModel, setPendingVinModel] = useState<string>('');

  // Set initial brand ID when vehicle data or car brands change
  useEffect(() => {
    if (initialFormData.brand && carBrands.length > 0) {
      const matchingBrand = carBrands.find(brand => brand.name === initialFormData.brand);
      if (matchingBrand) {
        setSelectedBrandId(matchingBrand.id);
      }
    }
  }, [initialFormData.brand, carBrands]);

  // Handle pending VIN model selection once models are loaded
  useEffect(() => {
    console.log('Checking pending VIN model:', pendingVinModel, 'Available models:', carModels);
    
    if (pendingVinModel && carModels.length > 0) {
      const matchingModel = carModels.find(model => {
        const modelName = model.name.toLowerCase();
        const pendingName = pendingVinModel.toLowerCase();
        
        return modelName === pendingName || 
               modelName.includes(pendingName) || 
               pendingName.includes(modelName);
      });
      
      console.log('Found matching model:', matchingModel);
      
      if (matchingModel) {
        onFormDataChange(prev => ({
          ...prev,
          model: matchingModel.name
        }));
        console.log('Model set to:', matchingModel.name);
        setPendingVinModel('');
      } else {
        console.log('No matching model found for:', pendingVinModel);
        // Si aucun modèle correspondant trouvé, on efface le pending model
        setPendingVinModel('');
      }
    }
  }, [carModels, pendingVinModel, onFormDataChange]);

  const handleVinChange = (vinValue: string, currentFormData: any) => {
    const upperValue = vinValue.toUpperCase();
    const updatedFormData = {
      ...currentFormData,
      vin: upperValue
    };

    if (isValidVin(upperValue)) {
      const vinInfo = decodeVin(upperValue);
      console.log('VIN décodé:', vinInfo);
      
      if (vinInfo.brand) {
        const matchingBrand = carBrands.find(brand => 
          brand.name.toLowerCase() === vinInfo.brand?.toLowerCase()
        );
        
        if (matchingBrand) {
          setSelectedBrandId(matchingBrand.id);
          updatedFormData.brand = matchingBrand.name;
          updatedFormData.year = vinInfo.year || currentFormData.year;

          // Vérifier que le modèle est une chaîne valide
          if (vinInfo.model && typeof vinInfo.model === 'string' && vinInfo.model.trim()) {
            console.log('Setting pending VIN model:', vinInfo.model);
            setPendingVinModel(vinInfo.model);
          } else {
            console.log('No valid model detected from VIN');
            setPendingVinModel('');
          }
        }
      }
    } else {
      // Si le VIN n'est pas valide, on nettoie les pending models
      setPendingVinModel('');
    }

    return updatedFormData;
  };

  const handleBrandChange = (brandId: string, currentFormData: any) => {
    const selectedBrand = carBrands.find(brand => brand.id === brandId);
    if (selectedBrand) {
      setSelectedBrandId(brandId);
      setPendingVinModel('');
      return {
        ...currentFormData,
        brand: selectedBrand.name,
        model: ''
      };
    }
    return currentFormData;
  };

  const handleModelChange = (modelName: string, currentFormData: any) => {
    setPendingVinModel('');
    return {
      ...currentFormData,
      model: modelName
    };
  };

  return {
    selectedBrandId,
    carModels,
    handleVinChange,
    handleBrandChange,
    handleModelChange
  };
}
