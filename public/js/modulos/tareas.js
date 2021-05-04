// VIDEO 62, 63, 64, 65
import axios from "axios";
import Swal from 'sweetalert2';

import {actualizarAvance} from '../funciones/avance'; //VID 68 los .. indica que subo dos niveles dentro de las carpetas

const tareas = document.querySelector('.listado-pendientes');

if(tareas) {
    tareas.addEventListener('click', (e)=> {
        //console.log(e.target.classList); En consola de inspeccionar elemento se ve como funciona el Listener.
        if(e.target.classList.contains('fa-check-circle')){
            //console.log('Actualizando...'); Otra forma de ver como funciona esto.
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea; //Obtener el ID de la tarea, mediante el uso de las clases de tareas.pug  
            //console.log(idTarea);

            //Request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            //console.log(url);
            axios.patch(url, {idTarea})
                .then(function(respuesta){
                    //console.log(respuesta);
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');
                        actualizarAvance(); //Aca actualizamos tarea completa o incompleta, asique aca actualizamos la barra de estado tambien. VID 68
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')){
            //Video 65, 66
            const tareaHTML = e.target.parentElement.parentElement, 
                    idTarea = tareaHTML.dataset.tarea;
            // console.log(tareaHTML);
            // console.log(idTarea);
                    Swal.fire({
                        title: 'Desea borrar esta tarea?',
                        text: "Una tarea eliminada no se puede recuperar",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, borrar',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => { 
                        if (result.isConfirmed) {
                            //const url = `${location.origin}/tareas/${idTarea}`;
                            const url = `${location.origin}/tareas/${idTarea}`;
                            // console.log(url);
                            //Enviar el delete por medio de Axios. Enviamos al servidor.
                            axios.delete(url, { params: { idTarea }})
                                .then(function(respuesta){
                                    if(respuesta.status === 200){
                                        console.log(respuesta);
                                        //Eliminar el NODO de la interface
                                        tareaHTML.parentElement.removeChild(tareaHTML);//Esto elimina de la interfaz grafica sin necesidad de recargar la pagina.
                                        //Opcional Alerta
                                        Swal.fire(
                                            'Tarea Eliminada',
                                            respuesta.data,
                                            'success'
                                        )//La respuesta viene del controlador.
                                        actualizarAvance();//Al eliminar una tarea tambien tenemos que actualizar la barra de estado.
                                    }
                                });//Tengo que configurar el delete en el ROUTER.    
                        }
                    })        
        }
    });  
}
export default tareas;