// Contact Form Handler with Formspree Integration and Plan Selection
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm")
  const submitBtn = document.getElementById("submitBtn")
  const successModal = document.getElementById("successModal")

  // Real-time validation
  const inputs = form.querySelectorAll("input, select, textarea")
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this)
    })

    input.addEventListener("input", function () {
      if (this.closest(".form-group").classList.contains("error")) {
        validateField(this)
      }
    })
  })

  // Radio button validation
  const radioButtons = form.querySelectorAll('input[name="book_status"]')
  radioButtons.forEach((radio) => {
    radio.addEventListener("change", () => {
      clearError("bookStatusError")
      document.querySelector('.form-group:has(input[name="book_status"])').classList.remove("error")
    })
  })

  // Form submission
  form.addEventListener("submit", handleSubmit)
})

// Plan selection function
function selectPlan(planName, planPrice) {
  // Update form fields
  document.getElementById("selectedPlan").value = planName
  document.getElementById("planPricing").value = planPrice

  // Clear any existing errors
  clearError("selectedPlanError")
  clearError("planPricingError")
  document.getElementById("selectedPlan").closest(".form-group").classList.remove("error")
  document.getElementById("planPricing").closest(".form-group").classList.remove("error")

  // Update button states
  document.querySelectorAll(".plan-btn").forEach((btn) => {
    btn.classList.remove("selected")
    btn.textContent = "Choose This Plan"
  })

  // Mark selected button
  event.target.classList.add("selected")
  event.target.textContent = "Selected ✓"

  // Add visual feedback
  document.querySelectorAll(".pricing-card").forEach((card) => {
    card.style.transform = ""
    card.style.boxShadow = ""
  })

  const selectedCard = event.target.closest(".pricing-card")
  selectedCard.style.transform = "translateY(-4px) scale(1.02)"
  selectedCard.style.boxShadow = "0 20px 40px rgba(16, 185, 129, 0.2)"

  // Smooth scroll to form
  setTimeout(() => {
    document.querySelector(".contact-form").scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }, 300)
}

function validateField(field) {
  const fieldName = field.name
  const value = field.value.trim()
  let isValid = true

  // Clear previous errors
  const errorId =
    fieldName.replace("_", "").replace(/([A-Z])/g, (match, letter, index) => {
      return index === 0 ? letter.toLowerCase() : letter
    }) + "Error"

  clearError(errorId)
  field.closest(".form-group").classList.remove("error")

  switch (fieldName) {
    case "author_name":
      if (!value) {
        showError("authorNameError", "Author name is required")
        isValid = false
      } else if (value.length < 2) {
        showError("authorNameError", "Author name must be at least 2 characters")
        isValid = false
      }
      break

    case "book_name":
      if (!value) {
        showError("bookNameError", "Book title is required")
        isValid = false
      } else if (value.length < 2) {
        showError("bookNameError", "Book title must be at least 2 characters")
        isValid = false
      }
      break

    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value) {
        showError("emailError", "Email is required")
        isValid = false
      } else if (!emailRegex.test(value)) {
        showError("emailError", "Please enter a valid email address")
        isValid = false
      }
      break

    case "contact_number":
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (!value) {
        showError("contactNoError", "Contact number is required")
        isValid = false
      } else if (!phoneRegex.test(value.replace(/[\s\-()]/g, ""))) {
        showError("contactNoError", "Please enter a valid contact number")
        isValid = false
      }
      break

    case "selected_plan":
      if (!value) {
        showError("selectedPlanError", "Please select a plan")
        isValid = false
      }
      break

    case "plan_pricing":
      if (!value) {
        showError("planPricingError", "Plan pricing is required")
        isValid = false
      }
      break

    case "genre":
      if (!value) {
        showError("genreError", "Please select a genre")
        isValid = false
      }
      break

    case "message":
      if (value.length > 1000) {
        showError("messageError", "Message must be less than 1000 characters")
        isValid = false
      }
      break
  }

  return isValid
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId)
  const formGroup = errorElement.closest(".form-group")

  errorElement.textContent = message
  errorElement.classList.add("show")
  formGroup.classList.add("error")
}

function clearError(elementId) {
  const errorElement = document.getElementById(elementId)
  if (errorElement) {
    const formGroup = errorElement.closest(".form-group")
    errorElement.classList.remove("show")
    formGroup.classList.remove("error")
  }
}

async function handleSubmit(event) {
  event.preventDefault()

  const form = event.target
  const formData = new FormData(form)
  const submitBtn = document.getElementById("submitBtn")

  // Validate all fields
  let isFormValid = true

  // Validate text inputs and select
  const textInputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], select')
  textInputs.forEach((input) => {
    if (!validateField(input)) {
      isFormValid = false
    }
  })

  // Validate radio buttons
  const bookStatus = formData.get("book_status")
  if (!bookStatus) {
    showError("bookStatusError", "Please select book status")
    isFormValid = false
  }

  // Validate plan selection
  const selectedPlan = formData.get("selected_plan")
  const planPricing = formData.get("plan_pricing")

  if (!selectedPlan) {
    showError("selectedPlanError", "Please select a plan")
    isFormValid = false
  }

  if (!planPricing) {
    showError("planPricingError", "Plan pricing is required")
    isFormValid = false
  }

  if (!isFormValid) {
    // Scroll to first error
    const firstError = document.querySelector(".form-group.error")
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" })
    }
    return
  }

  // Show loading state
  submitBtn.classList.add("loading")
  submitBtn.disabled = true

  try {
    // Submit to Formspree
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })

    if (response.ok) {
      // Show success modal
      showSuccessModal()

      // Reset form
      form.reset()

      // Reset plan selection
      document.querySelectorAll(".plan-btn").forEach((btn) => {
        btn.classList.remove("selected")
        btn.textContent = "Choose This Plan"
      })

      document.querySelectorAll(".pricing-card").forEach((card) => {
        card.style.transform = ""
        card.style.boxShadow = ""
      })

      // Clear all errors
      document.querySelectorAll(".error-message").forEach((error) => {
        error.classList.remove("show")
      })
      document.querySelectorAll(".form-group").forEach((group) => {
        group.classList.remove("error")
      })
    } else {
      throw new Error("Form submission failed")
    }
  } catch (error) {
    console.error("Error:", error)
    alert("There was an error submitting the form. Please try again.")
  } finally {
    // Reset loading state
    submitBtn.classList.remove("loading")
    submitBtn.disabled = false
  }
}

function showSuccessModal() {
  const modal = document.getElementById("successModal")
  modal.classList.add("show")
  document.body.style.overflow = "hidden"
}

function closeSuccessModal() {
  const modal = document.getElementById("successModal")
  modal.classList.remove("show")
  document.body.style.overflow = ""
}

// Close modal when clicking overlay
document.getElementById("successModal").addEventListener("click", function (e) {
  if (e.target === this || e.target.classList.contains("modal-overlay")) {
    closeSuccessModal()
  }
})

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSuccessModal()
  }
})

// Add smooth scrolling for better UX
function smoothScrollToError() {
  const firstError = document.querySelector(".form-group.error")
  if (firstError) {
    firstError.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }
}

// Add form reset functionality
function resetForm() {
  const form = document.getElementById("contactForm")

  // Reset form fields
  form.reset()

  // Reset plan selection
  document.querySelectorAll(".plan-btn").forEach((btn) => {
    btn.classList.remove("selected")
    btn.textContent = "Choose This Plan"
  })

  document.querySelectorAll(".pricing-card").forEach((card) => {
    card.style.transform = ""
    card.style.boxShadow = ""
  })

  // Clear all error messages
  document.querySelectorAll(".error-message").forEach((error) => {
    error.classList.remove("show")
  })

  // Remove error styling
  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("error")
  })

  // Focus on first input
  document.getElementById("authorName").focus()
}
