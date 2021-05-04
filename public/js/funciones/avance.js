import Swal from 'sweetalert2';//VID 68

export const actualizarAvance = ()=>{
    //Seleccionar las tareas existentes VIDEO 68.
    const tareas = document.querySelectorAll('li.tarea');//Selecciono solo los li.tarea

    //Revisar que tenemos multiples tareas. Este codigo solo se va a ejecutar donde alla tareas.
    if(tareas.length){

        //Seleccionar las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');
        //Calcular el avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);
        //Mostrar el avance
        const porcentaje = document.querySelector('#porcentaje'); //#porcentaje es un ID dentro de los estilos.
        porcentaje.style.width = avance+'%';

        if(avance===100){
            Swal.fire(
                'Completaste el Proyecto',
                'Felicidades, has terminado tus tareas',
                'success'  
            )
        }
    }    
}