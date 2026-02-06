import MainLayout from './components/MainLayout';
import DeepZoomViewer from './components/DeepZoomViewer';
import SafetyGuardDiff from './components/SafetyGuardDiff';


function App() {
  return (
    <MainLayout rightPanel={<SafetyGuardDiff />}>
      <DeepZoomViewer />
    </MainLayout>
  );
}

export default App;
