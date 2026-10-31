import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { AllJobsPage } from './pages/AllJobsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { DepartmentDirectoryPage } from './pages/DepartmentDirectoryPage';
import { StateWiseJobsPage } from './pages/StateWiseJobsPage';
import { ExamCalendarPage } from './pages/ExamCalendarPage';
import { AuthPage } from './pages/AuthPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutContactPage } from './pages/AboutContactPage';
import { LearningHelpPage } from './pages/LearningHelpPage';

// Modals
import { GazettePdfModal } from './components/GazettePdfModal';
import { OfficialApplyModal } from './components/OfficialApplyModal';
import { EligibilityCalculatorModal } from './components/EligibilityCalculatorModal';
import { JobAlertModal } from './components/JobAlertModal';
import { CronSyncModal } from './components/CronSyncModal';
import { Job } from './types';
import { JobService } from './services/jobService';

const AppContent: React.FC = () => {
  const { textScale } = useAuth();

  // Modals state
  const [activePdfJob, setActivePdfJob] = useState<Job | null>(null);
  const [activeApplyJob, setActiveApplyJob] = useState<Job | null>(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [cronModalOpen, setCronModalOpen] = useState(false);

  // Background sync with Supabase on mount
  React.useEffect(() => {
    JobService.syncFromSupabase();
  }, []);

  // Text scaling style
  const getTextScaleClass = () => {
    if (textScale === 'sm') return 'text-[13px]';
    if (textScale === 'lg') return 'text-[16px]';
    return 'text-[14px]';
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30] antialiased ${getTextScaleClass()}`}>
      {/* Fixed Header */}
      <Navbar 
        onOpenAlerts={() => setAlertsOpen(true)}
        onOpenCalculator={() => setCalculatorOpen(true)}
        onOpenCron={() => setCronModalOpen(true)}
      />

      {/* Main Routed Area */}
      <main className="flex-1 w-full pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  onOpenPdfModal={(job) => setActivePdfJob(job)}
                  onOpenApplyModal={(job) => setActiveApplyJob(job)}
                  onOpenCalculator={() => setCalculatorOpen(true)}
                  onOpenAlerts={() => setAlertsOpen(true)}
                />
              } 
            />
            <Route 
              path="/jobs" 
              element={
                <AllJobsPage 
                  onOpenPdfModal={(job) => setActivePdfJob(job)}
                  onOpenApplyModal={(job) => setActiveApplyJob(job)}
                />
              } 
            />
            <Route 
              path="/jobs/:id" 
              element={
                <JobDetailsPage 
                  onOpenPdfModal={(job) => setActivePdfJob(job)}
                  onOpenApplyModal={(job) => setActiveApplyJob(job)}
                />
              } 
            />
            <Route path="/departments" element={<DepartmentDirectoryPage />} />
            <Route path="/states" element={<StateWiseJobsPage />} />
            <Route path="/calendar" element={<ExamCalendarPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/dashboard" 
              element={
                <UserDashboardPage 
                  onOpenPdfModal={(job) => setActivePdfJob(job)}
                  onOpenApplyModal={(job) => setActiveApplyJob(job)}
                />
              } 
            />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/learning-support" element={<LearningHelpPage />} />
            <Route path="/about" element={<AboutContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {/* Comprehensive Civic Footer */}
      <Footer />

      {/* Shared Global Modals */}
      <GazettePdfModal
        job={activePdfJob}
        isOpen={Boolean(activePdfJob)}
        onClose={() => setActivePdfJob(null)}
      />

      <OfficialApplyModal
        job={activeApplyJob}
        isOpen={Boolean(activeApplyJob)}
        onClose={() => setActiveApplyJob(null)}
      />

      <EligibilityCalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />

      <JobAlertModal
        isOpen={alertsOpen}
        onClose={() => setAlertsOpen(false)}
      />

      <CronSyncModal
        isOpen={cronModalOpen}
        onClose={() => setCronModalOpen(false)}
        onJobsRefreshed={() => {
          JobService.syncFromSupabase();
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
