const answers = {
  1: {correct:"b", why:"¡Correcto! >= significa mayor o igual. Así también se incluye la nota 3.0."},
  2: {correct:"b", why:"¡Bien! 7 no es mayor que 10; por eso la condición es falsa."},
  3: {correct:"b", why:"Exactamente. Si la condición es falsa, las instrucciones dentro del Si no se ejecutan."},
  4: {correct:"b", why:"¡Correcto! 16 no es mayor o igual que 18. Como no hay SiNo, no aparece ningún mensaje."},
  5: {correct:"a", why:"¡Muy bien! 8 MOD 2 da 0; la condición se cumple y aparece «Es par»."},
  6: {correct:"b", why:"Correcto. >= 120 permite ingresar a quienes miden exactamente 120 cm o más."},
  7: {correct:"a", why:"¡Así es! El símbolo > comprueba que la temperatura sea estrictamente superior a 30."},
  8: {correct:"c", why:"Correcto. El símbolo = comprueba que la clave sea exactamente igual a 1234."},
  9: {correct:"b", why:"¡Excelente! Primero se escribe Si, luego la condición y Entonces; después las instrucciones y finalmente FinSi."},
  10:{correct:"a", why:"¡Correcto! <= significa menor o igual. Como 100 es igual a 100, la condición es verdadera."}
};
const completed = new Set();
let score = 0;
const total = Object.keys(answers).length;
const toast = document.getElementById("toast");

function notify(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(()=>toast.classList.remove("show"),2600);
}
function updateProgress(){
  const count = completed.size;
  const correctCount = score / 10;
  document.getElementById("score").textContent = score + " XP";
  document.getElementById("completed").textContent = count + " / " + total;
  const percent = Math.round(count / total * 100);
  document.getElementById("progressText").textContent = percent + "%";
  document.getElementById("progressBar").style.width = percent + "%";

  const name = document.getElementById("studentName").value.trim();
  const course = document.getElementById("studentCourse").value.trim();
  document.getElementById("resultStudent").textContent = name || "Escribe tu nombre al inicio";
  document.getElementById("resultCourse").textContent = course || "No indicado";
  document.getElementById("correctCount").textContent = correctCount + " / 10";
  document.getElementById("resultPoints").textContent = score + " XP";
  document.getElementById("finalScore").textContent = score + "/100";

  const panel = document.getElementById("resultPanel");
  if(count === total){
    panel.classList.add("completed-report");
    document.getElementById("resultTitle").textContent = score >= 80 ? "¡Misión cumplida, programador/a!" : "¡Has completado la misión!";
    document.getElementById("resultDescription").textContent = "Este es tu resultado final. Verifica que tu nombre y curso estén escritos correctamente.";
    document.getElementById("screenshotHint").textContent = "¡Listo! Toma una captura de pantalla de este reporte completo y envíala a tu docente por WhatsApp.";
    notify("¡Misión completada! Tu reporte final está listo.");
    setTimeout(()=>panel.scrollIntoView({behavior:"smooth",block:"center"}),350);
  } else {
    panel.classList.remove("completed-report");
    document.getElementById("resultTitle").textContent = "¡Sigue avanzando!";
    document.getElementById("resultDescription").textContent = `Has completado ${count} de ${total} retos.`;
    document.getElementById("screenshotHint").textContent = "Cuando termines los 10 retos, toma una captura de pantalla de este reporte y envíala a tu docente por WhatsApp.";
  }
}
document.querySelectorAll(".challenge").forEach(card=>{
  const id = Number(card.dataset.challenge);
  card.querySelectorAll(".options button").forEach(button=>{
    button.addEventListener("click",()=>{
      if(completed.has(id)) return;
      const correct = button.dataset.answer === answers[id].correct;
      card.querySelectorAll(".options button").forEach(option=>{
        option.disabled = true;
        if(option.dataset.answer === answers[id].correct) option.classList.add("correct");
      });
      if(!correct) button.classList.add("incorrect");
      const feedback = card.querySelector(".feedback");
      feedback.textContent = (correct ? "✓ " : "✕ ") + answers[id].why;
      feedback.className = "feedback " + (correct ? "good" : "bad");
      completed.add(id);
      if(correct) score += 10;
      updateProgress();
    });
  });
});
document.getElementById("startBtn").addEventListener("click",()=>{
  const name = document.getElementById("studentName").value.trim();
  if(!name){notify("Escribe tu nombre para comenzar.");document.getElementById("studentName").focus();return;}
  notify("¡Bienvenido/a, " + name + "! Tu misión ha comenzado.");
  document.getElementById("aprender").scrollIntoView({behavior:"smooth"});
});
document.getElementById("resetBtn").addEventListener("click",()=>{
  if(!confirm("¿Quieres reiniciar la misión? Se borrará el puntaje y las respuestas de esta sesión.")) return;
  completed.clear();score=0;
  document.querySelectorAll(".challenge").forEach(card=>{
    card.querySelectorAll(".options button").forEach(button=>{button.disabled=false;button.classList.remove("correct","incorrect");});
    const feedback=card.querySelector(".feedback");feedback.textContent="";feedback.className="feedback";
  });
  updateProgress();notify("Misión reiniciada. ¡A intentarlo de nuevo!");
  document.getElementById("inicio").scrollIntoView({behavior:"smooth"});
});
const navLinks = [...document.querySelectorAll(".mission-nav a")];
const sections = navLinks.map(a=>document.querySelector(a.getAttribute("href")));
window.addEventListener("scroll",()=>{
  let current=sections[0];
  sections.forEach(section=>{if(section && window.scrollY >= section.offsetTop-150) current=section;});
  navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+current.id));
},{passive:true});
updateProgress();

document.getElementById("studentName").addEventListener("input", updateProgress);
document.getElementById("studentCourse").addEventListener("input", updateProgress);
