import { debugData } from './utils/debugData';
import UiComponent from './components/interface'

debugData([{
  action:'openUi',
  data:{
    job: 'burgershot',
    grade: 'boss',
    permissions: ["nav.Dashboard","nav.Facture","nav.Grade","nav.Personnel","perso.promote","perso.demote","perso.layoff","grade.Perms","grade.Edit","grade.create"]
  }
}])

const App: React.FC = () => {
  return (
    <>
      <UiComponent />
    </>
  )
}

export default App
