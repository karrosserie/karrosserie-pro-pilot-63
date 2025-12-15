import { useState, useEffect, useMemo, useRef } from 'react';

const PVReceptionVehicule = ({ dossier = {}, reparateur = {}, onSubmit, onCancel, onPrint }: any) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    numeroDossier: dossier.id?.toString() || '',
    dateRemise: new Date().toISOString().split('T')[0],
    heureRemise: new Date().toTimeString().slice(0, 5),
    raisonSociale: reparateur.raisonSociale || 'Karrosserie.pro',
    siret: reparateur.siret || '',
    adresseReparateur: reparateur.adresse || '',
    nomClient: dossier.nom || '',
    prenomClient: dossier.prenom || '',
    telClient: dossier.mobile || '',
    emailClient: dossier.email || '',
    immatriculation: dossier.immatriculation || '',
    marqueModele: dossier.marqueModele || '',
    vin: dossier.vin || '',
    kmEntree: dossier.kmEntree || '',
    kmSortie: dossier.kmSortie || '',
    numeroSinistre: dossier.numeroSinistre || '',
    travaux: dossier.travaux || [
      { designation: dossier.notes || '', conforme: null },
      { designation: '', conforme: null },
      { designation: '', conforme: null }
    ],
    controleGeometrie: false,
    controleCalibrageADAS: false,
    controleEssaiRoutier: false,
    controleNettoyage: true,
    carteGrise: false,
    cles: true,
    nombreCles: '2',
    carnetEntretien: false,
    roueSecours: false,
    triangleGilet: false,
    niveauCarburant: '1/2',
    montantTTC: dossier.montantTTC || '',
    resteACharge: dossier.resteACharge || '0',
    garantiePieces: '24',
    garantieMainOeuvre: '12',
    garantiePeinture: '3',
    accepteReception: false,
    accepteQualite: false,
    accepteDelaiReserves: false,
    accepteDocuments: false,
    reserves: '',
    lieuSignature: '',
    mediateur: reparateur.mediateur || 'CM2C - 14 rue Saint Jean 75017 Paris'
  });
  const [signatures, setSignatures] = useState<{ reparateur: string | null; client: string | null }>({ reparateur: null, client: null });
  const [signatureMode, setSignatureMode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleTravauxChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      travaux: prev.travaux.map((t: any, i: number) => i === index ? { ...t, [field]: value } : t)
    }));
  };

  const addTravail = () => {
    setFormData(prev => ({ ...prev, travaux: [...prev.travaux, { designation: '', conforme: null }] }));
  };

  const removeTravail = (index: number) => {
    if (formData.travaux.length > 1) {
      setFormData(prev => ({ ...prev, travaux: prev.travaux.filter((_: any, i: number) => i !== index) }));
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
    ctx?.beginPath();
    ctx?.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
    if (ctx) {
      ctx.lineTo(clientX - rect.left, clientY - rect.top);
      ctx.strokeStyle = '#1E3A5F';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    if (canvasRef.current) {
      canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const saveSignature = () => {
    if (!canvasRef.current || !signatureMode) return;
    setSignatures(prev => ({ ...prev, [signatureMode]: canvasRef.current!.toDataURL() }));
    setSignatureMode(null);
  };

  const validateForm = () => {
    if (!formData.nomClient) { alert('Nom client obligatoire'); return false; }
    if (!formData.immatriculation) { alert('Immatriculation obligatoire'); return false; }
    if (!formData.accepteReception || !formData.accepteQualite || !formData.accepteDelaiReserves || !formData.accepteDocuments) {
      alert('Cocher toutes les cases'); return false;
    }
    if (!signatures.client) { alert('Signature client obligatoire'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (onSubmit) await onSubmit({ ...formData, signatures, dateGeneration: new Date().toISOString(), statut: 'signe' });
    } catch (error) {
      alert('Erreur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allAccepted = formData.accepteReception && formData.accepteQualite && formData.accepteDelaiReserves && formData.accepteDocuments;

  return (
    <div className="bg-card rounded-2xl shadow-2xl max-w-4xl mx-auto overflow-hidden">
      <div className="bg-gradient-to-r from-karrosserie-blue to-indigo-900 text-white p-6 text-center">
        <h1 className="text-2xl font-bold">📋 PROCÈS-VERBAL DE RÉCEPTION VÉHICULE</h1>
        <p className="text-blue-200 mt-1">Document juridique de restitution</p>
        <div className="mt-3 flex justify-center gap-4">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">📅 {new Date().toLocaleDateString('fr-FR')}</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">🚗 {formData.immatriculation}</span>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted rounded-xl">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">N° Dossier</label>
            <input type="text" name="numeroDossier" value={formData.numeroDossier} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-muted font-mono" readOnly />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Date</label>
            <input type="date" name="dateRemise" value={formData.dateRemise} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Heure</label>
            <input type="time" name="heureRemise" value={formData.heureRemise} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden">
          <div className="bg-karrosserie-blue text-white px-4 py-2 font-semibold">👥 1. PARTIES</div>
          <div className="p-4 grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-karrosserie-blue">RÉPARATEUR</h3>
              <input type="text" name="raisonSociale" value={formData.raisonSociale} onChange={handleChange} placeholder="Raison sociale" className="w-full px-3 py-2 border rounded-lg" />
              <input type="text" name="siret" value={formData.siret} onChange={handleChange} placeholder="SIRET" className="w-full px-3 py-2 border rounded-lg" />
              <input type="text" name="adresseReparateur" value={formData.adresseReparateur} onChange={handleChange} placeholder="Adresse" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-green-700 dark:text-green-400">CLIENT</h3>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" name="nomClient" value={formData.nomClient} onChange={handleChange} placeholder="Nom *" className="px-3 py-2 border rounded-lg" />
                <input type="text" name="prenomClient" value={formData.prenomClient} onChange={handleChange} placeholder="Prénom" className="px-3 py-2 border rounded-lg" />
              </div>
              <input type="tel" name="telClient" value={formData.telClient} onChange={handleChange} placeholder="Téléphone" className="w-full px-3 py-2 border rounded-lg" />
              <input type="email" name="emailClient" value={formData.emailClient} onChange={handleChange} placeholder="Email" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden">
          <div className="bg-karrosserie-blue text-white px-4 py-2 font-semibold">🚗 2. VÉHICULE</div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Immatriculation *</label>
              <input type="text" name="immatriculation" value={formData.immatriculation} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg font-bold uppercase bg-yellow-50 dark:bg-yellow-950/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Marque/Modèle</label>
              <input type="text" name="marqueModele" value={formData.marqueModele} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">VIN</label>
              <input type="text" name="vin" value={formData.vin} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Km entrée</label>
              <input type="number" name="kmEntree" value={formData.kmEntree} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Km sortie</label>
              <input type="number" name="kmSortie" value={formData.kmSortie} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">N° sinistre</label>
              <input type="text" name="numeroSinistre" value={formData.numeroSinistre} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden">
          <div className="bg-karrosserie-blue text-white px-4 py-2 font-semibold">🔧 3. TRAVAUX</div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-2 text-sm">DÉSIGNATION</th>
                  <th className="text-center p-2 text-sm w-40">CONFORME</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {formData.travaux.map((travail: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      <input
                        type="text"
                        value={travail.designation}
                        onChange={(e) => handleTravauxChange(index, 'designation', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Description..."
                      />
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex justify-center gap-4">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name={`conforme-${index}`}
                            checked={travail.conforme === true}
                            onChange={() => handleTravauxChange(index, 'conforme', true)}
                          />
                          <span className="text-green-600">✓Oui</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name={`conforme-${index}`}
                            checked={travail.conforme === false}
                            onChange={() => handleTravauxChange(index, 'conforme', false)}
                          />
                          <span className="text-red-600">✗Non</span>
                        </label>
                      </div>
                    </td>
                    <td className="p-2">
                      <button type="button" onClick={() => removeTravail(index)} className="text-red-500">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={addTravail} className="mt-3 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm">➕ Ajouter</button>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Contrôles:</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { name: 'controleGeometrie', label: 'Géométrie' },
                  { name: 'controleCalibrageADAS', label: 'ADAS' },
                  { name: 'controleEssaiRoutier', label: 'Essai' },
                  { name: 'controleNettoyage', label: 'Nettoyage' }
                ].map(ctrl => (
                  <label key={ctrl.name} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name={ctrl.name}
                      checked={(formData as any)[ctrl.name]}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{ctrl.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden">
          <div className="bg-karrosserie-blue text-white px-4 py-2 font-semibold">📦 4. RESTITUTION</div>
          <div className="p-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Documents:</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { name: 'carteGrise', label: 'Carte grise' },
                  { name: 'cles', label: 'Clés' },
                  { name: 'carnetEntretien', label: 'Carnet' },
                  { name: 'roueSecours', label: 'Roue secours' },
                  { name: 'triangleGilet', label: 'Triangle/Gilet' }
                ].map(doc => (
                  <label key={doc.name} className="flex items-center gap-2 cursor-pointer bg-muted px-3 py-2 rounded-lg">
                    <input
                      type="checkbox"
                      name={doc.name}
                      checked={(formData as any)[doc.name]}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{doc.label}</span>
                  </label>
                ))}
                {formData.cles && (
                  <input
                    type="number"
                    name="nombreCles"
                    value={formData.nombreCles}
                    onChange={handleChange}
                    className="w-16 px-2 py-1 border rounded text-center"
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Carburant</label>
                <select name="niveauCarburant" value={formData.niveauCarburant} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">--</option>
                  <option value="1/4">1/4</option>
                  <option value="1/2">1/2</option>
                  <option value="3/4">3/4</option>
                  <option value="plein">Plein</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Montant TTC €</label>
                <input type="number" name="montantTTC" value={formData.montantTTC} onChange={handleChange} step="0.01" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Reste à charge €</label>
                <input type="number" name="resteACharge" value={formData.resteACharge} onChange={handleChange} step="0.01" className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden">
          <div className="bg-karrosserie-blue text-white px-4 py-2 font-semibold">🛡️ 5. GARANTIES</div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Pièces (mois)</label>
                <input type="number" name="garantiePieces" value={formData.garantiePieces} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-center font-bold" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">MO (mois)</label>
                <input type="number" name="garantieMainOeuvre" value={formData.garantieMainOeuvre} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-center font-bold" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Peinture (ans)</label>
                <input type="number" name="garantiePeinture" value={formData.garantiePeinture} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-center font-bold" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">Garantie légale 2 ans (L.217-4 C.conso)</p>
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden">
          <div className="bg-green-700 text-white px-4 py-2 font-semibold">✅ 6. ACCEPTATION</div>
          <div className="p-4 bg-green-50 dark:bg-green-950/30">
            <p className="font-semibold text-green-800 dark:text-green-300 mb-4">Le Client reconnaît:</p>
            <div className="space-y-3">
              {[
                { name: 'accepteReception', text: 'Véhicule réceptionné en parfait état' },
                { name: 'accepteQualite', text: 'Qualité des travaux approuvée (art. 1792-6 C.civ.)' },
                { name: 'accepteDelaiReserves', text: 'Informé du droit de réserves sous 8 jours' },
                { name: 'accepteDocuments', text: 'Documents et accessoires récupérés' }
              ].map(item => (
                <label key={item.name} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer ${(formData as any)[item.name] ? 'bg-green-200 dark:bg-green-800/50' : 'bg-white dark:bg-card'}`}>
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={(formData as any)[item.name]}
                    onChange={handleChange}
                    className="w-5 h-5 mt-0.5"
                  />
                  <span className="text-sm">{item.text}</span>
                </label>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-foreground block mb-1">Réserves:</label>
              <textarea name="reserves" value={formData.reserves} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" rows={2} />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-xl p-4">
          <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">⚖️ 7. FONDEMENTS JURIDIQUES</h3>
          <p className="text-xs text-amber-900 dark:text-amber-200">Art. 1103, 1217, 1641-1649, 1792-6, 2286 C.civ. ; L.111-1, L.217-4 à L.217-14 C.conso. ; L.121-17 C.assur. La remise des clés vaut renonciation au droit de rétention et acceptation des travaux.</p>
        </div>

        <div className="border rounded-xl overflow-hidden">
          <div className="bg-karrosserie-blue text-white px-4 py-2 font-semibold">✍️ 8. SIGNATURES</div>
          <div className="p-4">
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground">Fait à:</label>
              <input type="text" name="lieuSignature" value={formData.lieuSignature} onChange={handleChange} placeholder="Ville" className="ml-2 px-3 py-1 border rounded-lg" />
              <span className="ml-4 text-muted-foreground">le {new Date().toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold mb-1">RÉPARATEUR</p>
                <p className="text-xs text-muted-foreground mb-2">(Cachet et signature)</p>
                <div
                  onClick={() => setSignatureMode('reparateur')}
                  className={`border-2 border-dashed rounded-lg p-4 h-32 flex items-center justify-center cursor-pointer ${signatures.reparateur ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : 'border-border hover:border-primary'}`}
                >
                  {signatures.reparateur ? <img src={signatures.reparateur} alt="Sig" className="max-h-full" /> : <span className="text-muted-foreground">Cliquer</span>}
                </div>
              </div>
              <div>
                <p className="font-semibold mb-1">CLIENT</p>
                <p className="text-xs text-muted-foreground mb-2">"Lu et approuvé"</p>
                <div
                  onClick={() => setSignatureMode('client')}
                  className={`border-2 border-dashed rounded-lg p-4 h-32 flex items-center justify-center cursor-pointer ${signatures.client ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : 'border-border hover:border-primary'}`}
                >
                  {signatures.client ? <img src={signatures.client} alt="Sig" className="max-h-full" /> : <span className="text-muted-foreground">Cliquer *</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-3">
          <label className="text-xs font-medium text-muted-foreground">Médiateur:</label>
          <input type="text" name="mediateur" value={formData.mediateur} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
        </div>

        <div className="flex flex-wrap gap-3 justify-end pt-4 border-t">
          {onCancel && <button type="button" onClick={onCancel} className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl font-medium">❌ Annuler</button>}
          <button type="button" onClick={() => window.print()} className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl font-medium">🖨️ Imprimer</button>
          <button
            type="submit"
            disabled={isSubmitting || !allAccepted || !signatures.client}
            className={`px-8 py-3 rounded-xl font-semibold text-white ${allAccepted && signatures.client ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg' : 'bg-muted-foreground cursor-not-allowed'}`}
          >
            {isSubmitting ? '⏳...' : '✅ Valider et Clôturer'}
          </button>
        </div>
      </form>

      {signatureMode && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">✍️ Signature {signatureMode === 'client' ? 'Client' : 'Réparateur'}</h3>
            {signatureMode === 'client' && <p className="text-sm text-muted-foreground mb-3 bg-yellow-50 dark:bg-yellow-950/30 p-2 rounded">"Lu et approuvé" puis signer</p>}
            <canvas
              ref={canvasRef}
              width={350}
              height={150}
              className="border-2 border-border rounded-lg w-full touch-none bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={clearSignature} className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg">🗑️</button>
              <button type="button" onClick={() => setSignatureMode(null)} className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg">Annuler</button>
              <button type="button" onClick={saveSignature} className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium">✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface Dossier {
  id: number;
  nom: string;
  prenom: string;
  immatriculation: string;
  mobile: string;
  email?: string;
  dateEntree: string;
  heureEntree: string;
  status: string;
  expertisePrevue?: boolean;
  expertiseEffectuee?: boolean;
  dateExpertise?: string;
  heureExpertise?: string;
  dateFin?: string;
  dateRestitution?: string;
  heureRestitution?: string;
  notes?: string;
  marqueModele?: string;
  vin?: string;
  numeroSinistre?: string;
  kmEntree?: string;
  montantTTC?: string;
  resteACharge?: string;
  piecesAttente?: string;
  pvReception?: any;
  dateCloture?: string;
  relances: Array<{ date: string; type: string; msg: string }>;
  historique: Array<{ date: string; action: string; status: string }>;
}

interface Alert {
  type: string;
  dossier: Dossier;
  countdown?: number;
}

export default function GestionAtelier() {
  const [dossiers, setDossiers] = useState<Dossier[]>([
    { id: 1001, nom: 'Martin', prenom: 'Jean', immatriculation: 'AB-123-CD', mobile: '06 12 34 56 78', email: 'jean.martin@email.com', dateEntree: '2025-01-10', heureEntree: '09:00', status: 'expertise_planifiee', expertisePrevue: true, dateExpertise: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString().split('T')[0], heureExpertise: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toTimeString().slice(0, 5), notes: 'Choc avant droit', marqueModele: 'Peugeot 308', vin: 'VF3LBHZTXJS123456', numeroSinistre: 'SIN-2025-00123', kmEntree: '45230', relances: [], historique: [{ date: '2025-01-10T09:00:00', action: 'Création', status: 'entree_atelier' }] },
    { id: 1002, nom: 'Dupont', prenom: 'Marie', immatriculation: 'EF-456-GH', mobile: '06 98 76 54 32', email: 'marie.dupont@email.com', dateEntree: '2025-01-08', heureEntree: '14:30', status: 'termine', expertiseEffectuee: true, dateFin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), notes: 'Portière + peinture', marqueModele: 'Renault Clio V', kmEntree: '32100', montantTTC: '2450.00', relances: [], historique: [{ date: '2025-01-08T14:30:00', action: 'Création', status: 'entree_atelier' }] },
    { id: 1003, nom: 'Bernard', prenom: 'Pierre', immatriculation: 'IJ-789-KL', mobile: '06 11 22 33 44', dateEntree: '2025-01-07', heureEntree: '11:00', status: 'rdv_restitution', dateRestitution: new Date().toISOString().split('T')[0], heureRestitution: '16:00', notes: 'Client VIP', marqueModele: 'Porsche 911', kmEntree: '12500', montantTTC: '8900.00', relances: [], historique: [{ date: '2025-01-07T11:00:00', action: 'Création', status: 'entree_atelier' }] },
    { id: 1004, nom: 'Petit', prenom: 'Sophie', immatriculation: 'MN-012-OP', mobile: '06 55 66 77 88', dateEntree: '2025-01-09', heureEntree: '08:30', status: 'en_reparation', notes: 'Pare-brise', marqueModele: 'Citroën C3', kmEntree: '67800', relances: [], historique: [{ date: '2025-01-09T08:30:00', action: 'Création', status: 'entree_atelier' }] }
  ]);
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  const [showNewDossier, setShowNewDossier] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showRestitutionModal, setShowRestitutionModal] = useState<Dossier | null>(null);
  const [showPVReception, setShowPVReception] = useState<Dossier | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    'entree_atelier': { label: 'Entrée', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300', icon: '🚗' },
    'attente_expertise': { label: 'Att. expertise', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300', icon: '📋' },
    'expertise_planifiee': { label: 'Exp. planifiée', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300', icon: '📅' },
    'expertise_effectuee': { label: 'Exp. effectuée', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300', icon: '✓' },
    'en_reparation': { label: 'En réparation', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', icon: '🔧' },
    'attente_pieces': { label: 'Att. pièces', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300', icon: '📦' },
    'termine': { label: 'Terminé', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300', icon: '✅' },
    'rdv_restitution': { label: 'RDV restitution', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300', icon: '🔑' },
    'cloture': { label: 'Clôturé', color: 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400', icon: '📁' }
  };

  const alertConfig: Record<string, { label: string; color: string; icon: string; priority: number }> = {
    expertise_24h: { label: 'Expertise < 24h', color: 'text-orange-600', icon: '⚠️', priority: 2 },
    expertise_2h: { label: 'Expertise < 2h', color: 'text-red-600', icon: '🚨', priority: 1 },
    expertise_passee: { label: 'Expertise passée', color: 'text-red-600', icon: '❗', priority: 0 },
    restitution_aujourdhui: { label: "Restitution aujourd'hui", color: 'text-orange-600', icon: '🔑', priority: 2 },
    restitution_passee: { label: 'Restitution passée', color: 'text-red-600', icon: '📞', priority: 0 },
    sans_rdv_restitution: { label: 'Sans RDV', color: 'text-red-600', icon: '⏳', priority: 1 }
  };

  const calculateAlerts = (d: Dossier): Alert[] => {
    const alerts: Alert[] = [];
    const now = currentTime;
    if (d.dateExpertise && d.status === 'expertise_planifiee') {
      const exp = new Date(`${d.dateExpertise}T${d.heureExpertise || '09:00'}`);
      const diff = exp.getTime() - now.getTime();
      if (diff < 0) alerts.push({ type: 'expertise_passee', dossier: d });
      else if (diff <= 2 * 60 * 60 * 1000) alerts.push({ type: 'expertise_2h', dossier: d, countdown: diff });
      else if (diff <= 24 * 60 * 60 * 1000) alerts.push({ type: 'expertise_24h', dossier: d, countdown: diff });
    }
    if (d.dateRestitution && d.status === 'rdv_restitution') {
      const rest = new Date(`${d.dateRestitution}T${d.heureRestitution || '09:00'}`);
      const diff = rest.getTime() - now.getTime();
      if (diff < 0) alerts.push({ type: 'restitution_passee', dossier: d });
      else if (rest.toDateString() === now.toDateString()) alerts.push({ type: 'restitution_aujourdhui', dossier: d, countdown: diff });
    }
    if (d.status === 'termine' && !d.dateRestitution && d.dateFin && (now.getTime() - new Date(d.dateFin).getTime()) > 60 * 60 * 1000) {
      alerts.push({ type: 'sans_rdv_restitution', dossier: d });
    }
    return alerts;
  };

  const allAlerts = useMemo(() =>
    dossiers.flatMap(d => calculateAlerts(d)).sort((a, b) => alertConfig[a.type].priority - alertConfig[b.type].priority),
    [dossiers, currentTime]
  );

  const [newDossier, setNewDossier] = useState({
    nom: '', prenom: '', immatriculation: '', mobile: '',
    dateEntree: new Date().toISOString().split('T')[0],
    heureEntree: new Date().toTimeString().slice(0, 5),
    expertisePrevue: false, dateExpertise: '', heureExpertise: '',
    notes: '', marqueModele: '', numeroSinistre: ''
  });

  const [restitutionForm, setRestitutionForm] = useState({ dateRestitution: '', heureRestitution: '' });

  const handleCreateDossier = () => {
    const d: Dossier = {
      ...newDossier,
      id: Date.now(),
      status: newDossier.expertisePrevue ? (newDossier.dateExpertise ? 'expertise_planifiee' : 'attente_expertise') : 'entree_atelier',
      relances: [],
      historique: [{ date: new Date().toISOString(), action: 'Création', status: 'entree_atelier' }]
    };
    setDossiers([d, ...dossiers]);
    setNewDossier({
      nom: '', prenom: '', immatriculation: '', mobile: '',
      dateEntree: new Date().toISOString().split('T')[0],
      heureEntree: new Date().toTimeString().slice(0, 5),
      expertisePrevue: false, dateExpertise: '', heureExpertise: '',
      notes: '', marqueModele: '', numeroSinistre: ''
    });
    setShowNewDossier(false);
  };

  const updateStatus = (id: number, status: string, data: Partial<Dossier> = {}) => {
    setDossiers(dossiers.map(d => d.id === id ? {
      ...d, status, ...data,
      historique: [...d.historique, { date: new Date().toISOString(), action: statusConfig[status].label, status }]
    } : d));
    if (selectedDossier?.id === id) setSelectedDossier(prev => prev ? { ...prev, status, ...data } : null);
  };

  const addRelance = (id: number, type: string, msg: string) => {
    setDossiers(dossiers.map(d => d.id === id ? {
      ...d, relances: [...(d.relances || []), { date: new Date().toISOString(), type, msg }]
    } : d));
  };

  const handlePlanifierRestitution = (id: number) => {
    if (restitutionForm.dateRestitution && restitutionForm.heureRestitution) {
      updateStatus(id, 'rdv_restitution', restitutionForm);
      setRestitutionForm({ dateRestitution: '', heureRestitution: '' });
      setShowRestitutionModal(null);
    }
  };

  const openPVReception = (d: Dossier) => {
    setShowPVReception(d);
    setSelectedDossier(null);
  };

  const handlePVSubmit = async (pv: any) => {
    if (showPVReception) {
      updateStatus(showPVReception.id, 'cloture', { dateCloture: new Date().toISOString(), pvReception: pv });
      setShowPVReception(null);
      alert('✅ PV validé !');
    }
  };

  const formatCountdown = (ms: number) => {
    if (ms < 0) return 'Passé';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 24 ? `${Math.floor(h / 24)}j` : `${h}h${m}m`;
  };

  const openWhatsApp = (d: Dossier, type: string) => {
    const phone = d.mobile.replace(/\s/g, '').replace(/^0/, '33');
    const msgs: Record<string, string> = {
      rappel_expertise: `Rappel expertise ${d.immatriculation} ${d.dateExpertise}`,
      rdv_restitution: `${d.immatriculation} prêt ! Contactez-nous.`,
      confirmation_restitution: `RDV ${d.dateRestitution} ${d.heureRestitution} pour ${d.immatriculation}`
    };
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msgs[type] || '')}`, '_blank');
    addRelance(d.id, 'WhatsApp', type);
  };

  const filteredDossiers = useMemo(() => dossiers.filter(d => {
    if (activeTab === 'alertes') return allAlerts.some(a => a.dossier.id === d.id);
    if (activeTab === 'expertise') return ['attente_expertise', 'expertise_planifiee'].includes(d.status);
    if (activeTab === 'restitution') return ['termine', 'rdv_restitution'].includes(d.status);
    if (activeTab === 'clotures') return d.status === 'cloture';
    return (filterStatus === 'all' || d.status === filterStatus) &&
      (searchTerm === '' || d.nom.toLowerCase().includes(searchTerm.toLowerCase()) || d.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()));
  }), [dossiers, filterStatus, searchTerm, activeTab, allAlerts]);

  const QuickActions = ({ dossier: d, compact }: { dossier: Dossier; compact?: boolean }) => {
    const actions: Array<{ label: string; icon: string; color: string; onClick: () => void; primary?: boolean }> = [];

    if (d.status === 'entree_atelier') {
      actions.push({ label: 'Expertise', icon: '📋', color: 'bg-indigo-500', onClick: () => updateStatus(d.id, 'attente_expertise') });
      actions.push({ label: 'Démarrer', icon: '▶️', color: 'bg-green-500', onClick: () => updateStatus(d.id, 'en_reparation', { dateDebut: new Date().toISOString() } as any) });
    }
    if (d.status === 'attente_expertise') {
      actions.push({
        label: 'Planifier', icon: '📅', color: 'bg-indigo-500', onClick: () => {
          const date = prompt('Date (YYYY-MM-DD):');
          const h = prompt('Heure (HH:MM):');
          if (date && h) updateStatus(d.id, 'expertise_planifiee', { dateExpertise: date, heureExpertise: h });
        }
      });
    }
    if (d.status === 'expertise_planifiee') {
      actions.push({ label: 'WhatsApp', icon: '💬', color: 'bg-green-600', onClick: () => openWhatsApp(d, 'rappel_expertise') });
      actions.push({ label: 'Effectuée', icon: '✓', color: 'bg-emerald-500', onClick: () => updateStatus(d.id, 'expertise_effectuee') });
    }
    if (d.status === 'expertise_effectuee') {
      actions.push({ label: 'Démarrer', icon: '▶️', color: 'bg-green-500', onClick: () => updateStatus(d.id, 'en_reparation') });
    }
    if (d.status === 'en_reparation') {
      actions.push({
        label: 'Pièces', icon: '📦', color: 'bg-amber-500', onClick: () => {
          const p = prompt('Pièces:');
          if (p) updateStatus(d.id, 'attente_pieces', { piecesAttente: p });
        }
      });
      actions.push({ label: 'Terminé', icon: '✅', color: 'bg-emerald-500', onClick: () => updateStatus(d.id, 'termine', { dateFin: new Date().toISOString() }) });
    }
    if (d.status === 'attente_pieces') {
      actions.push({ label: 'Reçues', icon: '📦', color: 'bg-green-500', onClick: () => updateStatus(d.id, 'en_reparation') });
    }
    if (d.status === 'termine') {
      actions.push({ label: 'WhatsApp', icon: '💬', color: 'bg-green-600', onClick: () => openWhatsApp(d, 'rdv_restitution') });
      actions.push({ label: 'RDV', icon: '🔑', color: 'bg-indigo-500', onClick: () => setShowRestitutionModal(d) });
    }
    if (d.status === 'rdv_restitution') {
      actions.push({ label: 'WhatsApp', icon: '💬', color: 'bg-green-600', onClick: () => openWhatsApp(d, 'confirmation_restitution') });
      actions.push({ label: '📋 Signer PV', icon: '✍️', color: 'bg-gradient-to-r from-karrosserie-blue to-purple-600', onClick: () => openPVReception(d), primary: true });
    }

    const show = compact ? actions.slice(0, 2) : actions;
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {show.map((a, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); a.onClick(); }}
            className={`${a.color} text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:scale-105 transition-transform ${a.primary ? 'ring-2 ring-purple-400' : ''}`}
          >
            <span>{a.icon}</span>{a.label}
          </button>
        ))}
        {compact && actions.length > 2 && <span className="text-sm text-muted-foreground">+{actions.length - 2}</span>}
      </div>
    );
  };

  const DossierAlerts = ({ dossier: d }: { dossier: Dossier }) => {
    const alerts = calculateAlerts(d);
    if (!alerts.length) return null;
    return (
      <div className="mt-2">
        {alerts.map((a, i) => (
          <div key={i} className={`flex items-center gap-2 text-sm ${alertConfig[a.type].color} font-medium`}>
            <span>{alertConfig[a.type].icon}</span>
            <span>{alertConfig[a.type].label}</span>
            {a.countdown && <span className="ml-auto font-mono">{formatCountdown(a.countdown)}</span>}
          </div>
        ))}
      </div>
    );
  };

  if (showPVReception) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-background dark:to-background p-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setShowPVReception(null)} className="mb-4 px-4 py-2 bg-card rounded-lg shadow">← Retour</button>
          <PVReceptionVehicule
            dossier={showPVReception}
            reparateur={{ raisonSociale: 'Karrosserie.pro', siret: '123 456 789 00012', adresse: '15 rue Carrosserie, 75001 Paris' }}
            onSubmit={handlePVSubmit}
            onCancel={() => setShowPVReception(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-background dark:to-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="bg-card rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">🔧 Gestion Atelier</h1>
              <p className="text-muted-foreground mt-1">Karrosserie.pro</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAlerts(true)} className="relative p-2 rounded-full hover:bg-muted">
                <span className="text-2xl">🔔</span>
                {allAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {allAlerts.length}
                  </span>
                )}
              </button>
              <button onClick={() => setShowNewDossier(true)} className="bg-gradient-to-r from-karrosserie-orange to-orange-500 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-transform">
                🚗 Nouveau
              </button>
            </div>
          </div>

          {allAlerts.filter(a => alertConfig[a.type].priority <= 1).length > 0 && (
            <div onClick={() => setShowAlerts(true)} className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-4 cursor-pointer">
              <span className="text-3xl animate-bounce">🚨</span>
              <div>
                <p className="font-semibold text-red-600">{allAlerts.filter(a => alertConfig[a.type].priority <= 1).length} alerte(s)</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(statusConfig).filter(([k]) => !['cloture', 'expertise_effectuee'].includes(k)).slice(0, 5).map(([k, v]) => {
              const c = dossiers.filter(d => d.status === k).length;
              const alert = allAlerts.some(a => a.dossier.status === k && alertConfig[a.type].priority <= 1);
              return (
                <div key={k} className={`bg-muted rounded-xl p-3 ${alert ? 'ring-2 ring-red-400' : ''}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground truncate">{v.label}</p>
                      <p className="text-2xl font-bold">{c}</p>
                    </div>
                    <span className="text-2xl">{v.icon}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-4">
          <div className="flex flex-wrap gap-2 mb-4 border-b pb-3">
            {[
              { id: 'all', label: 'Tous', icon: '📋' },
              { id: 'alertes', label: 'Alertes', icon: '⚠️', count: allAlerts.length },
              { id: 'expertise', label: 'Expertises', icon: '🔍' },
              { id: 'restitution', label: 'Restitutions', icon: '🔑' },
              { id: 'clotures', label: 'Clôturés', icon: '📁' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === t.id ? 'bg-gradient-to-r from-karrosserie-orange to-orange-500 text-white' : 'bg-muted hover:bg-muted/80'}`}
              >
                <span>{t.icon}</span>{t.label}
                {t.count !== undefined && t.count > 0 && <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">{t.count}</span>}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="🔍 Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl"
            />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl bg-card">
              <option value="all">Tous</option>
              {Object.entries(statusConfig).map(([k, v]) => (<option key={k} value={k}>{v.icon} {v.label}</option>))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredDossiers.map(d => {
            const alerts = calculateAlerts(d);
            const urgent = alerts.some(a => alertConfig[a.type].priority <= 1);
            return (
              <div
                key={d.id}
                onClick={() => setSelectedDossier(d)}
                className={`bg-card rounded-2xl shadow-lg p-5 cursor-pointer hover:shadow-xl transition-shadow ${urgent ? 'border-l-4 border-red-500' : ''} ${d.status === 'rdv_restitution' ? 'ring-2 ring-cyan-300' : ''}`}
              >
                <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`${statusConfig[d.status].color} px-3 py-1.5 rounded-lg text-sm font-medium`}>
                      {statusConfig[d.status].icon} {statusConfig[d.status].label}
                    </span>
                    <span className="text-xl font-bold">{d.immatriculation}</span>
                    {d.marqueModele && <span className="text-sm text-muted-foreground">({d.marqueModele})</span>}
                  </div>
                  {d.pvReception && <span className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-2 py-1 rounded text-xs">✅ PV</span>}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>👤 {d.prenom} {d.nom}</span>
                  <span>📱 {d.mobile}</span>
                  {d.dateRestitution && <span className="text-cyan-600 font-medium">🔑 {d.dateRestitution} {d.heureRestitution}</span>}
                </div>
                <DossierAlerts dossier={d} />
                <QuickActions dossier={d} compact />
              </div>
            );
          })}
          {filteredDossiers.length === 0 && (
            <div className="bg-card rounded-2xl shadow-lg p-8 text-center">
              <span className="text-4xl">🔍</span>
              <p className="text-muted-foreground mt-2">Aucun véhicule</p>
            </div>
          )}
        </div>

        {showAlerts && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowAlerts(false)}>
            <div className="bg-card rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">🔔 Alertes</h2>
                <button onClick={() => setShowAlerts(false)} className="text-2xl">✕</button>
              </div>
              {allAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-5xl">✅</span>
                  <p className="text-muted-foreground mt-4">Aucune</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allAlerts.map((a, i) => (
                    <div
                      key={i}
                      onClick={() => { setSelectedDossier(a.dossier); setShowAlerts(false); }}
                      className={`p-4 rounded-xl cursor-pointer ${alertConfig[a.type].priority <= 1 ? 'bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500' : 'bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500'}`}
                    >
                      <p className={`font-semibold ${alertConfig[a.type].color}`}>{alertConfig[a.type].icon} {alertConfig[a.type].label}</p>
                      <p className="font-bold">{a.dossier.immatriculation}</p>
                      {a.countdown && <p className="font-mono text-sm">{formatCountdown(a.countdown)}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {showNewDossier && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowNewDossier(false)}>
            <div className="bg-card rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-6">🚗 Nouveau</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Nom *" value={newDossier.nom} onChange={e => setNewDossier({ ...newDossier, nom: e.target.value })} className="px-4 py-2.5 border rounded-xl" />
                  <input placeholder="Prénom" value={newDossier.prenom} onChange={e => setNewDossier({ ...newDossier, prenom: e.target.value })} className="px-4 py-2.5 border rounded-xl" />
                  <input placeholder="Immat *" value={newDossier.immatriculation} onChange={e => setNewDossier({ ...newDossier, immatriculation: e.target.value.toUpperCase() })} className="px-4 py-2.5 border rounded-xl" />
                  <input placeholder="Mobile" value={newDossier.mobile} onChange={e => setNewDossier({ ...newDossier, mobile: e.target.value })} className="px-4 py-2.5 border rounded-xl" />
                  <input placeholder="Marque/Modèle" value={newDossier.marqueModele} onChange={e => setNewDossier({ ...newDossier, marqueModele: e.target.value })} className="px-4 py-2.5 border rounded-xl" />
                  <input placeholder="N° Sinistre" value={newDossier.numeroSinistre} onChange={e => setNewDossier({ ...newDossier, numeroSinistre: e.target.value })} className="px-4 py-2.5 border rounded-xl" />
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={newDossier.expertisePrevue} onChange={e => setNewDossier({ ...newDossier, expertisePrevue: e.target.checked })} className="w-5 h-5" />
                  <span>Expertise prévue</span>
                </label>
                {newDossier.expertisePrevue && (
                  <div className="grid grid-cols-2 gap-3 ml-7">
                    <input type="date" value={newDossier.dateExpertise} onChange={e => setNewDossier({ ...newDossier, dateExpertise: e.target.value })} className="px-4 py-2.5 border rounded-xl" />
                    <input type="time" value={newDossier.heureExpertise} onChange={e => setNewDossier({ ...newDossier, heureExpertise: e.target.value })} className="px-4 py-2.5 border rounded-xl" />
                  </div>
                )}
                <textarea placeholder="Notes" value={newDossier.notes} onChange={e => setNewDossier({ ...newDossier, notes: e.target.value })} rows={2} className="w-full px-4 py-2.5 border rounded-xl" />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleCreateDossier} disabled={!newDossier.nom || !newDossier.immatriculation} className="flex-1 bg-gradient-to-r from-karrosserie-orange to-orange-500 text-white py-3 rounded-xl font-medium disabled:opacity-50">Créer</button>
                <button onClick={() => setShowNewDossier(false)} className="px-6 py-3 border rounded-xl">Annuler</button>
              </div>
            </div>
          </div>
        )}

        {showRestitutionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowRestitutionModal(null)}>
            <div className="bg-card rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-2">🔑 RDV</h2>
              <p className="text-muted-foreground mb-6">{showRestitutionModal.immatriculation}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-sm block mb-1">Date</label>
                  <input type="date" value={restitutionForm.dateRestitution} onChange={e => setRestitutionForm({ ...restitutionForm, dateRestitution: e.target.value })} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="text-sm block mb-1">Heure</label>
                  <input type="time" value={restitutionForm.heureRestitution} onChange={e => setRestitutionForm({ ...restitutionForm, heureRestitution: e.target.value })} className="w-full px-4 py-2.5 border rounded-xl" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handlePlanifierRestitution(showRestitutionModal.id)} disabled={!restitutionForm.dateRestitution || !restitutionForm.heureRestitution} className="flex-1 bg-gradient-to-r from-karrosserie-orange to-orange-500 text-white py-3 rounded-xl font-medium disabled:opacity-50">OK</button>
                <button onClick={() => setShowRestitutionModal(null)} className="px-6 py-3 border rounded-xl">Annuler</button>
              </div>
            </div>
          </div>
        )}

        {selectedDossier && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedDossier(null)}>
            <div className="bg-card rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedDossier.immatriculation}</h2>
                  <p className="text-muted-foreground">{selectedDossier.prenom} {selectedDossier.nom} • {selectedDossier.mobile}</p>
                </div>
                <button onClick={() => setSelectedDossier(null)} className="text-2xl">✕</button>
              </div>
              {calculateAlerts(selectedDossier).length > 0 && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                  {calculateAlerts(selectedDossier).map((a, i) => (
                    <p key={i} className={`${alertConfig[a.type].color} font-medium`}>
                      {alertConfig[a.type].icon} {alertConfig[a.type].label}
                      {a.countdown && <span className="ml-2 font-mono">{formatCountdown(a.countdown)}</span>}
                    </p>
                  ))}
                </div>
              )}
              <div className="mb-6">
                <span className={`${statusConfig[selectedDossier.status].color} px-4 py-2 rounded-xl font-medium inline-flex items-center gap-2`}>
                  {statusConfig[selectedDossier.status].icon} {statusConfig[selectedDossier.status].label}
                </span>
              </div>
              <div className="grid md:grid-cols-3 gap-3 mb-6">
                {selectedDossier.marqueModele && (
                  <div className="bg-muted rounded-xl p-4">
                    <h3 className="font-semibold text-foreground mb-1">🚗 Véhicule</h3>
                    <p>{selectedDossier.marqueModele}</p>
                  </div>
                )}
                {selectedDossier.numeroSinistre && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4">
                    <h3 className="font-semibold text-karrosserie-blue mb-1">📋 Sinistre</h3>
                    <p>{selectedDossier.numeroSinistre}</p>
                  </div>
                )}
                {selectedDossier.dateRestitution && (
                  <div className="bg-cyan-50 dark:bg-cyan-950/30 rounded-xl p-4">
                    <h3 className="font-semibold text-cyan-700 dark:text-cyan-400 mb-1">🔑 Restitution</h3>
                    <p>{selectedDossier.dateRestitution} {selectedDossier.heureRestitution}</p>
                  </div>
                )}
                {selectedDossier.montantTTC && (
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4">
                    <h3 className="font-semibold text-green-700 dark:text-green-400 mb-1">💶 Montant</h3>
                    <p className="text-lg font-bold">{selectedDossier.montantTTC} €</p>
                  </div>
                )}
              </div>
              {selectedDossier.notes && (
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-karrosserie-blue mb-1">📝 Notes</h3>
                  <p>{selectedDossier.notes}</p>
                </div>
              )}
              {selectedDossier.pvReception && (
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-300 dark:border-green-700 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-green-700 dark:text-green-400">✅ PV signé</h3>
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Actions</h3>
                <QuickActions dossier={selectedDossier} />
              </div>
              <div className="border-t pt-6">
                <h3 className="font-semibold text-foreground mb-4">📋 Historique</h3>
                <div className="space-y-3 pl-4 border-l-2 border-purple-200 dark:border-purple-800">
                  {[...selectedDossier.historique].reverse().map((e, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[1.35rem] w-3 h-3 rounded-full bg-purple-500" />
                      <p className="font-medium">{e.action}</p>
                      <p className="text-sm text-muted-foreground">{new Date(e.date).toLocaleString('fr-FR')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
