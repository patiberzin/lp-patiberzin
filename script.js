document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------
  // FAQ - ABRE E FECHA
  // --------------------------------
  const faqHeaders = document.querySelectorAll(".faq-items h3");

  if (faqHeaders.length > 0) {
    faqHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const paragraph = header.nextElementSibling;
        const isOpen = paragraph.style.display === "block";

        // Fecha todos os parágrafos
        document.querySelectorAll(".faq-items p").forEach((p) => {
          p.style.display = "none";
        });

        // Abre o clicado, se não estava aberto
        if (!isOpen) {
          paragraph.style.display = "block";
        }
      });
    });
  }

  // --------------------------------
  // ENVIO DE FORMULÁRIO PARA FORMSPREE (AJAX) com Pop-up
  // --------------------------------
  const form = document.querySelector(".form-lead");
  const submitButton = document.getElementById("submit-button"); // Adicionei um ID ao botão

  // Variável para armazenar o timeout do pop-up, para poder limpá-lo se necessário
  let popupTimeout;

  // Função para exibir o pop-up de mensagem
  function showFormMessage(message, type = "success", duration = 4000) { // type: 'success', 'error', 'warning'
    // Remove qualquer pop-up existente
    const existingPopup = form.querySelector(".form-message-popup");
    if (existingPopup) {
      existingPopup.remove();
      clearTimeout(popupTimeout); // Limpa o timeout anterior, se houver
    }

    // Cria o novo elemento do pop-up
    const popup = document.createElement("div");
    popup.classList.add("form-message-popup", type); // Adiciona classes para estilo e tipo
    popup.textContent = message;

    // Adiciona o pop-up ao formulário
    // É importante adicioná-lo ao formulário, pois ele terá position:relative
    form.appendChild(popup);

    // Força o reflow para garantir que a transição de opacidade funcione
    void popup.offsetWidth; // truque para forçar reflow

    // Adiciona a classe 'show' para iniciar a transição de opacidade
    popup.classList.add("show");

    // Faz a mensagem desaparecer após a duração especificada
    popupTimeout = setTimeout(() => {
      popup.classList.remove("show"); // Inicia a transição para desaparecer
      popup.addEventListener('transitionend', () => { // Remove o elemento após a transição
        popup.remove();
      }, { once: true }); // Garante que o listener seja removido após uma execução
    }, duration);
  }

  if (form && submitButton) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Impede o envio padrão do formulário

      // Verifica se todos os campos obrigatórios têm um valor
      const requiredInputs = form.querySelectorAll('[required]');
      let allFieldsFilled = true;
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          allFieldsFilled = false;
        }
      });

      if (!allFieldsFilled) {
        showFormMessage("Por favor, preencha todos os campos obrigatórios.", "error", 5000);
        return; // Sai da função, não tenta enviar
      }

      const formData = new FormData(form);
      const url = form.action;

      // Desabilita o botão para evitar múltiplos envios
      submitButton.disabled = true;
      submitButton.textContent = "Enviando..."; // Mensagem de feedback

      try {
        const response = await fetch(url, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          showFormMessage("Mensagem enviada com sucesso! Em breve entrarei em contato.", "success");
          form.reset(); // Limpa o formulário após o sucesso
        } else {
          const data = await response.json();
          let errorMessage = "Ocorreu um erro ao enviar a mensagem. Tente novamente.";

          if (data && data.errors) {
            errorMessage = data.errors
              .map((error) => error.message)
              .join(", ");
          } else if (data && data.error) { // Às vezes, o erro pode vir em 'error'
            errorMessage = data.error;
          }

          showFormMessage(errorMessage, "error", 8000); // Exibe erro por mais tempo
        }
      } catch (error) {
        console.error("Erro no envio do formulário:", error);
        showFormMessage("Ocorreu um erro de rede. Verifique sua conexão.", "error", 8000);
      } finally {
        submitButton.disabled = false; // Reabilita o botão
        submitButton.textContent = "Quero minha LP"; // Restaura o texto original do botão
      }
    });
  } else {
    console.warn("Formulário '.form-lead' ou botão 'submit-button' não encontrados no DOM.");
  }
});