import facture from "./facture";
import grades from "./grades";
import personnel from "./personnel";
import dashboard from "./dashboard";

interface AppPage {
    component: React.FC;
    permissions: string[];
}

const appPages: { [key: string]: AppPage }  = {
    'Dashboard': {component: dashboard, permissions: ['nav.Dashboard']},
    'Facture(s)': {component: facture, permissions: ['nav.Facture']},
    'Grade(s)':{component: grades, permissions: ['nav.Grade']},
    'Personnel':{component: personnel, permissions: ['nav.Personnel']},
}


export { appPages }