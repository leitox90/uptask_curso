import proyectos from './modulos/proyectos'; //VIDEO 53 Esta sintaxis es posible porque instalamos Babel. Vid 54
import tareas from './modulos/tareas'; //VIDEO 62
import {actualizarAvance} from './funciones/avance'; //VID 67

document.addEventListener('DOMContentLoaded', ()=>{
    actualizarAvance();
})