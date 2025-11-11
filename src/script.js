
/**
 * Admina darf: Standorte anlegen, existierende Standorte 
 *              löschen und bearbeiten
 * Normalo darf:sich alle Standorte angucken, 
 *              aber nicht löschen oder bearbeiten 
 *              darf diese aber weder bearbeiten noch
 *              löschen. ‚normalo‘ darf keine Standorte anlegen
 */
const USER = [
    { username:"admina", password:"password", 
        role:"admin", name:"Mina" },
    { username:"normale", password:"password", 
    role:"non-admin", name:"Norman" }
]

