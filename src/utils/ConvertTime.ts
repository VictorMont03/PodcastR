export function convertToTypeString(duration: number){
    const hours = Math.floor(duration / 3600); //arredonda para baixo
    //const minutes = Math.floor((duration/3600)*60); 
    const minutes = Math.floor((duration % 3600)/60); 
    const seconds = duration % 60;

    const time = [hours, minutes, seconds].map(unit => String(unit).padStart(2, '0')).join(':');
     //adciona 0 caso seja menor que duas casas decimais
     return time;
}