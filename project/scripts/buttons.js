// test.js

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".action-btn");
  const sections = document.querySelectorAll(".panel");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");

      // 1. Remove active state from all buttons
      buttons.forEach(btn => btn.classList.remove("active"));

      // 2. Add active state to the clicked button
      button.classList.add("active");

      // 3. Hide all sections
      sections.forEach(section => section.classList.remove("section-active"));

      // 4. Show the selected section
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add("section-active");
        console.log(`Switched to section: ${targetId}`);
      } else {
        console.error(`Section with ID "${targetId}" not found`);
      }
    });
  });
});
