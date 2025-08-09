import { Router } from 'express';
import { externalDataService } from '../external-apis';

const router = Router();

// Fetch latest studies from PubMed
router.get('/pubmed-studies', async (req, res) => {
  try {
    const query = req.query.q as string || 'medical cannabis clinical trial';
    const studies = await externalDataService.fetchPubMedStudies(query);
    res.json({ studies, count: studies.length, source: 'PubMed' });
  } catch (error) {
    console.error('PubMed API error:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do PubMed' });
  }
});

// Fetch clinical trials
router.get('/clinical-trials', async (req, res) => {
  try {
    const condition = req.query.condition as string || 'medical cannabis';
    const trials = await externalDataService.fetchClinicalTrials(condition);
    res.json({ trials, count: trials.length, source: 'ClinicalTrials.gov' });
  } catch (error) {
    console.error('ClinicalTrials.gov API error:', error);
    res.status(500).json({ error: 'Erro ao buscar ensaios clínicos' });
  }
});

// Fetch Brazilian regulatory updates
router.get('/brazilian-regulation', async (req, res) => {
  try {
    const updates = await externalDataService.fetchBrazilianRegulation();
    res.json({ updates, count: updates.length, source: 'ANVISA' });
  } catch (error) {
    console.error('Brazilian regulation API error:', error);
    res.status(500).json({ error: 'Erro ao buscar atualizações regulatórias' });
  }
});

// Comprehensive data sync endpoint
router.post('/sync-all', async (req, res) => {
  try {
    const [pubmedStudies, clinicalTrials, regulationUpdates] = await Promise.all([
      externalDataService.fetchPubMedStudies(),
      externalDataService.fetchClinicalTrials(),
      externalDataService.fetchBrazilianRegulation()
    ]);

    const syncResult = {
      timestamp: new Date().toISOString(),
      pubmedStudies: { count: pubmedStudies.length, data: pubmedStudies },
      clinicalTrials: { count: clinicalTrials.length, data: clinicalTrials },
      regulationUpdates: { count: regulationUpdates.length, data: regulationUpdates },
      totalNewData: pubmedStudies.length + clinicalTrials.length + regulationUpdates.length
    };

    res.json({
      success: true,
      message: `Sincronização concluída: ${syncResult.totalNewData} novos dados encontrados`,
      data: syncResult
    });
  } catch (error) {
    console.error('Data sync error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro durante sincronização de dados externos' 
    });
  }
});

export default router;