/* ============================================================
   COS 106 PORTFOLIO, Abam Emmanuel Dodeye
   FILE: js/main.js
   PURPOSE: Single JavaScript file for the entire portfolio.
   All pages share this one file. Functions are written to check
   whether the elements they need actually exist on the current page
   before running, so no errors occur on pages where an element
   is absent.

   Contents:
   1. NAV SCROLL BEHAVIOUR
   2. MOBILE NAV TOGGLE
   3. SCROLL INDICATOR HIDE
   4. INTERSECTION OBSERVER (Scroll Reveal)
   5. COUNT-UP ANIMATION
============================================================ */


/* ============================================================
   SECTION 1: NAV SCROLL BEHAVIOUR
   When the user scrolls down more than 50 pixels, the "scrolled"
   class is added to the nav element. The CSS uses this class to
   transition the nav background from transparent to solid dark.
   When the user scrolls back to the very top, the class is removed
   and the nav becomes transparent again.

   What to understand: classList.toggle(class, condition) adds the
   class when condition is true and removes it when condition is false,
   all in one clean line instead of separate if/else branches.
============================================================ */

// Select the nav element by its ID
const navbar = document.getElementById('navbar');

// Only run if the navbar exists on this page
if (navbar) {

  // SCROLL EVENT LISTENER: Fires every time the user scrolls
  window.addEventListener('scroll', function () {

    // window.scrollY is the number of pixels scrolled from the top.
    // classList.toggle adds "scrolled" if scrollY > 50, removes it if not.
    navbar.classList.toggle('scrolled', window.scrollY > 50);

  });

}


/* ============================================================
   SECTION 2: MOBILE NAV TOGGLE
   The hamburger button is only visible on screens 768px wide and below.
   Clicking it adds or removes the "nav-open" class on the nav links list.
   The CSS uses "nav-open" to show or hide the dropdown menu.
   The nav is also closed automatically when a link inside it is clicked,
   so the menu does not stay open after the user navigates.

   What to understand: classList.toggle() without a second argument
   simply flips the class. If it is there, remove it. If it is not, add it.
============================================================ */

// Select the hamburger button and the nav links list
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

// Only run if both elements exist on this page
if (navToggle && navLinks) {

  // HAMBURGER CLICK: Toggle the open/closed state of the mobile menu
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('nav-open');
  });

  // CLOSE ON LINK CLICK: When any nav link is clicked, close the menu.
  // querySelectorAll returns a NodeList of all matching elements.
  // forEach loops over each one to attach the same listener to each link.
  navLinks.querySelectorAll('a').forEach(function (link) {

    link.addEventListener('click', function () {
      navLinks.classList.remove('nav-open');
    });

  });

}


/* ============================================================
   SECTION 3: SCROLL INDICATOR HIDE
   The bouncing arrow in the hero section is a visual hint to scroll down.
   Once the user has scrolled more than 100 pixels, it is no longer needed,
   so the "hidden" class is added to fade it out via CSS opacity transition.

   What to understand: This is a UX (user experience) decision. The arrow
   serves a purpose at the very start but becomes visual noise once the
   user is actively scrolling. Hiding it improves the experience.
============================================================ */

// Select the scroll indicator element
const scrollIndicator = document.getElementById('scrollIndicator');

// Only run if the scroll indicator exists (it only appears on the homepage)
if (scrollIndicator) {

  window.addEventListener('scroll', function () {

    // If scrolled more than 100px, add the "hidden" class to fade it out.
    // CSS handles the actual opacity transition, JS just adds the trigger class.
    if (window.scrollY > 100) {
      scrollIndicator.classList.add('hidden');
    } else {
      scrollIndicator.classList.remove('hidden');
    }

  });

}


/* ============================================================
   SECTION 4: INTERSECTION OBSERVER (Scroll Reveal)
   The Intersection Observer API watches elements in the DOM and fires
   a callback when they enter or leave the visible area of the screen.

   How it works here:
   - Every element with the class "reveal" starts hidden (opacity 0,
     shifted 30px down, defined in CSS).
   - The Observer watches all of them.
   - When one becomes 10% visible (threshold: 0.1), the callback fires.
   - The callback adds the "revealed" class which triggers the CSS transition
     to full opacity at the element's natural position.
   - unobserve() stops watching the element after it has revealed once,
     which is more efficient than watching elements that are already visible.

   What to understand: This is the modern, performant way to trigger
   animations on scroll. The older approach used scroll event listeners
   and getBoundingClientRect() which runs on every scroll event and can
   cause performance issues. Intersection Observer only fires when needed.
============================================================ */

// querySelectorAll returns a NodeList of every element with class "reveal"
const revealElements = document.querySelectorAll('.reveal');

// Only run if there are reveal elements on this page
if (revealElements.length > 0) {

  // CREATE OBSERVER: The callback receives an array of "entries".
  // Each entry represents one observed element and its intersection state.
const revealObserver = new IntersectionObserver(function (entries) {

    entries.forEach(function (entry) {

      /* REVEAL WHEN VISIBLE:
         isIntersecting is true when the element is inside the viewport.
         This now handles both scroll-in reveals AND elements that are 
         already visible on page load (like the top of the About page). */
      if (entry.isIntersecting) {

        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);

      }

    });

  }, {
    /* THRESHOLD 0: Fires as soon as any part of the element is visible.
       Lower threshold ensures content already on-screen at page load
       gets revealed immediately without needing to scroll. */
    threshold: 0,
    rootMargin: '0px 0px -50px 0px'
  });

  // OBSERVE EACH ELEMENT: Attach the observer to every element with class "reveal"
  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });

}


/* ============================================================
   SECTION 5: COUNT-UP ANIMATION
   The stats section shows numbers that count up from zero to their
   target value when they enter the viewport. This creates a dynamic
   feel and draws attention to key figures.

   How it works:
   - Each stat number element has a "data-target" HTML attribute
     containing the final number (e.g. data-target="3").
   - A separate Intersection Observer watches these elements.
   - When one enters view, the countUp() function runs for that element.
   - countUp() uses requestAnimationFrame to update the displayed number
     smoothly over a fixed duration (1500 milliseconds).

   What to understand:
   - data-* attributes are a standard HTML way to store custom data on elements.
   - dataset.target in JS reads the data-target attribute value.
   - requestAnimationFrame is the browser's built-in animation loop.
     It syncs with the screen's refresh rate (usually 60fps) for smooth animations.
   - parseInt() converts the string value of data-target to a number for maths.
============================================================ */

// Select all elements that have the data-target attribute (the stat numbers)
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

// Only run if stat number elements exist on this page
if (statNumbers.length > 0) {

  /* COUNT-UP FUNCTION
     Parameters:
     - element: the DOM element whose text content we are updating
     - target:  the final number to count to
     - duration: how long the animation takes in milliseconds
  */
  function countUp(element, target, duration) {

    // Record the exact time the animation starts (provided by requestAnimationFrame)
    let startTime = null;

    // ANIMATION FRAME FUNCTION: Called once per frame by the browser
    function animate(currentTime) {

      // On the very first frame, set the start time
      if (!startTime) startTime = currentTime;

      // ELAPSED: How many milliseconds have passed since the animation began
      const elapsed = currentTime - startTime;

      // PROGRESS: A number from 0 to 1 representing how far through the animation we are.
      // Math.min ensures it never exceeds 1 even if elapsed > duration.
      const progress = Math.min(elapsed / duration, 1);

      // CURRENT COUNT: Multiply the target by progress to get the current display number.
      // Math.floor rounds down so we always show whole numbers, not decimals.
      const current = Math.floor(progress * target);

      // UPDATE THE DOM: Set the text content of the element to the current count
      element.textContent = current;

      // CONTINUE OR STOP: If progress has not reached 1 yet, request the next frame.
      // When progress reaches 1, the animation is complete and we stop.
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // FINAL VALUE: Set exactly to target in case of any floating point rounding.
        element.textContent = target;
      }

    }

    // START THE ANIMATION: Request the first frame from the browser
    requestAnimationFrame(animate);

  }

  // INTERSECTION OBSERVER FOR STATS: Watches stat numbers and triggers countUp
  // when they enter the viewport. Uses a higher threshold (0.5) because these
  // elements are small and we want them mostly visible before the count starts.
  const statsObserver = new IntersectionObserver(function (entries) {

    entries.forEach(function (entry) {

      if (entry.isIntersecting) {

        // READ TARGET: Get the final number from the data-target HTML attribute.
        // parseInt with base 10 converts the string "3" to the number 3.
        const target = parseInt(entry.target.dataset.target, 10);

        // START COUNT-UP: Run the animation for 1500 milliseconds (1.5 seconds)
        countUp(entry.target, target, 1500);

        // STOP WATCHING: Only count up once, no need to watch further
        statsObserver.unobserve(entry.target);

      }

    });

  }, {
    threshold: 0.5
  });

  // OBSERVE EACH STAT NUMBER ELEMENT
  statNumbers.forEach(function (stat) {
    statsObserver.observe(stat);
  });

}
/* ============================================================
   SECTION 6: ACADEMIC PLANNER
   Interactive task manager. Handles adding, completing, deleting,
   and persisting tasks using the browser's LocalStorage.

   How LocalStorage works:
   - It is a key-value store built into every browser.
   - Data stored here survives page refreshes and browser restarts.
   - It only stores strings, so we use JSON.stringify to save
     objects and JSON.parse to read them back.

   How this planner works:
   1. On page load, we read saved tasks from LocalStorage.
   2. We render all tasks to the DOM.
   3. When the user adds a task, we push it to the tasks array,
      save the array to LocalStorage, and re-render.
   4. When the user completes or deletes a task, we update the
      array, save, and re-render.
============================================================ */

// Only run planner code if the task form exists on this page
const taskForm = document.getElementById('taskForm');

if (taskForm) {

  // GRAB ALL PLANNER ELEMENTS from the DOM once, up front
  const taskList       = document.getElementById('taskList');
  const emptyState     = document.getElementById('emptyState');
  const totalTasksEl   = document.getElementById('totalTasks');
  const pendingTasksEl = document.getElementById('pendingTasks');
  const completedTasksEl = document.getElementById('completedTasks');

  /* TASKS ARRAY
     This is our single source of truth. Every task is an object
     with id, title, subject, dueDate, and completed properties.
     The array is loaded from LocalStorage on page load. */
  let tasks = loadTasks();


  /* LOAD TASKS
     Reads the saved tasks from LocalStorage.
     If nothing is saved yet, returns an empty array.
     JSON.parse converts the saved string back into a real array. */
  function loadTasks() {
    const saved = localStorage.getItem('portfolioTasks');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  }


  /* SAVE TASKS
     Writes the current tasks array to LocalStorage.
     JSON.stringify converts the array into a string that can be stored. */
  function saveTasks() {
    localStorage.setItem('portfolioTasks', JSON.stringify(tasks));
  }


  /* UPDATE STATS
     Calculates the total, pending, and completed counts from the
     tasks array and updates the number displays in the DOM.
     Uses Array.filter to count subsets efficiently. */
  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(function (task) {
      return task.completed;
    }).length;
    const pending = total - completed;

    totalTasksEl.textContent     = total;
    pendingTasksEl.textContent   = pending;
    completedTasksEl.textContent = completed;
  }


  /* RENDER TASKS
     Clears the current task list in the DOM and rebuilds it from
     the tasks array. Called every time the array changes.

     Why rebuild the whole list instead of updating individual items:
     It is simpler, less error-prone, and fast enough for a task list.
     Frameworks like React use the same pattern with virtual DOM. */
  function renderTasks() {

    // CLEAR: Remove all current task cards from the DOM
    taskList.innerHTML = '';

    // EMPTY STATE: Show or hide the "no tasks yet" message
    if (tasks.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }

    // LOOP: Create a card for each task and add it to the list
    tasks.forEach(function (task) {

      // CREATE the outer <li> element
      const li = document.createElement('li');
      li.className = 'task-card';
      if (task.completed) {
        li.classList.add('completed');
      }
      li.dataset.id = task.id;

      // FORMAT the due date into a readable form
      const dueDisplay = task.dueDate 
        ? new Date(task.dueDate).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
          })
        : 'No date';

      // BUILD the inner HTML of the task card.
      // Using template literals (backticks) for readable multi-line strings. */
      li.innerHTML = `
        <button class="task-check" aria-label="Toggle complete"></button>
        <div class="task-info">
          <p class="task-title">${task.title}</p>
          <p class="task-meta">
            <span class="task-meta-subject">${task.subject}</span>
            <span>Due: ${dueDisplay}</span>
          </p>
        </div>
        <button class="task-delete">Delete</button>
      `;

      // ATTACH EVENT LISTENERS to the buttons inside the card
      const checkBtn  = li.querySelector('.task-check');
      const deleteBtn = li.querySelector('.task-delete');

      checkBtn.addEventListener('click', function () {
        toggleComplete(task.id);
      });

      deleteBtn.addEventListener('click', function () {
        deleteTask(task.id);
      });

      // ADD the finished card to the task list in the DOM
      taskList.appendChild(li);

    });

    // UPDATE STATS after rendering
    updateStats();
  }


  /* ADD TASK
     Creates a new task object and adds it to the tasks array.
     The id uses Date.now() which is milliseconds since 1970,
     guaranteed to be unique for tasks added in normal use. */
  function addTask(title, subject, dueDate) {
    const newTask = {
      id: Date.now(),
      title: title,
      subject: subject,
      dueDate: dueDate,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
  }


  /* TOGGLE COMPLETE
     Finds the task by id and flips its completed status.
     Array.find returns the first task matching the id, or undefined. */
  function toggleComplete(id) {
    const task = tasks.find(function (t) {
      return t.id === id;
    });

    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  }


  /* DELETE TASK
     Removes the task with the given id from the array using filter.
     Array.filter returns a new array containing only items that
     pass the test, effectively removing the deleted task. */
  function deleteTask(id) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });

    saveTasks();
    renderTasks();
  }


  /* FORM SUBMISSION
     Runs when the user clicks the Add Task button or presses Enter.
     event.preventDefault stops the browser from reloading the page,
     which is the default behavior for form submissions. */
  taskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // READ VALUES from the form inputs
    const title   = document.getElementById('taskTitle').value.trim();
    const subject = document.getElementById('taskSubject').value.trim();
    const dueDate = document.getElementById('taskDue').value;

    // VALIDATION: Make sure required fields are filled
    if (!title || !subject) {
      alert('Please enter both a task title and a subject.');
      return;
    }

    // ADD the task
    addTask(title, subject, dueDate);

    // RESET the form so the user can add another task easily
    taskForm.reset();
  });


  // INITIAL RENDER: Draw whatever is already in the array on page load
  renderTasks();

}
/* ============================================================
   SECTION 7: CONTACT FORM VALIDATION
   Handles validation for the contact form with custom error messages.
   Requirements from brief:
   - No empty fields
   - Valid email format
   - Digits-only phone number

   Why custom validation instead of browser default:
   Browser default shows ugly popups that cannot be styled.
   Custom validation lets us show errors under each field in our
   own black and gold design language, which is more professional.
============================================================ */

const contactForm = document.getElementById('contactForm');

if (contactForm) {

  // GRAB ALL FORM ELEMENTS
  const nameInput    = document.getElementById('contactName');
  const emailInput   = document.getElementById('contactEmail');
  const phoneInput   = document.getElementById('contactPhone');
  const messageInput = document.getElementById('contactMessage');

  const nameError    = document.getElementById('nameError');
  const emailError   = document.getElementById('emailError');
  const phoneError   = document.getElementById('phoneError');
  const messageError = document.getElementById('messageError');
  const successMsg   = document.getElementById('successMessage');


  /* HELPER: SHOW ERROR
     Adds error styling to the input and shows the message text.
     The error class gives the input a red border via CSS. */
  function showError(input, errorEl, message) {
    errorEl.textContent = message;
    input.classList.add('input-error');
  }


  /* HELPER: CLEAR ERROR
     Removes error styling and message. Used when user starts typing again. */
  function clearError(input, errorEl) {
    errorEl.textContent = '';
    input.classList.remove('input-error');
  }


  /* HELPER: VALIDATE EMAIL
     Uses a regular expression (regex) to check email format.
     Regex explained:
     ^             start of string
     [^\s@]+       one or more characters that are not space or @
     @             must contain an @ symbol
     [^\s@]+       one or more characters after @ that are not space or @
     \.            must contain a dot
     [^\s@]+       one or more characters after the dot
     $             end of string */
  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }


  /* HELPER: DIGITS ONLY CHECK
     Checks if the string contains only numbers 0 to 9.
     \d means any digit. + means one or more. ^ and $ anchor to full string.
     This satisfies the "digits-only phone" requirement from the brief. */
  function isDigitsOnly(phone) {
    const digitsPattern = /^\d+$/;
    return digitsPattern.test(phone);
  }


  /* VALIDATE ENTIRE FORM
     Runs all checks and returns true if every field passes.
     Called on form submit. Each failed check shows an error under that field. */
  function validateForm() {

    let isValid = true;

    // NAME: Cannot be empty and must be at least 2 characters
    const nameVal = nameInput.value.trim();
    if (nameVal === '') {
      showError(nameInput, nameError, 'Please enter your full name.');
      isValid = false;
    } else if (nameVal.length < 2) {
      showError(nameInput, nameError, 'Name must be at least 2 characters.');
      isValid = false;
    } else {
      clearError(nameInput, nameError);
    }

    // EMAIL: Cannot be empty and must match email pattern
    const emailVal = emailInput.value.trim();
    if (emailVal === '') {
      showError(emailInput, emailError, 'Please enter your email address.');
      isValid = false;
    } else if (!isValidEmail(emailVal)) {
      showError(emailInput, emailError, 'Please enter a valid email, e.g. name@example.com');
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // PHONE: Cannot be empty, digits only, at least 10 digits
    const phoneVal = phoneInput.value.trim();
    if (phoneVal === '') {
      showError(phoneInput, phoneError, 'Please enter your phone number.');
      isValid = false;
    } else if (!isDigitsOnly(phoneVal)) {
      showError(phoneInput, phoneError, 'Phone must contain digits only, no spaces or symbols.');
      isValid = false;
    } else if (phoneVal.length < 10) {
      showError(phoneInput, phoneError, 'Phone number must be at least 10 digits.');
      isValid = false;
    } else {
      clearError(phoneInput, phoneError);
    }

    // MESSAGE: Cannot be empty and must be at least 10 characters
    const messageVal = messageInput.value.trim();
    if (messageVal === '') {
      showError(messageInput, messageError, 'Please enter your message.');
      isValid = false;
    } else if (messageVal.length < 10) {
      showError(messageInput, messageError, 'Message must be at least 10 characters.');
      isValid = false;
    } else {
      clearError(messageInput, messageError);
    }

    return isValid;
  }


  /* FORM SUBMIT HANDLER
     preventDefault stops the page from reloading.
     If validation passes, show success message and reset form.
     setTimeout hides the success message after 5 seconds. */
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // HIDE previous success message on each new submit attempt
    successMsg.classList.add('hidden');

    // RUN VALIDATION
    const formIsValid = validateForm();

    if (formIsValid) {
      // SHOW success message
      successMsg.classList.remove('hidden');

      // RESET the form inputs to empty
      contactForm.reset();

      // HIDE success message after 5 seconds for a clean UX
      setTimeout(function () {
        successMsg.classList.add('hidden');
      }, 5000);
    }

  });


  /* REAL-TIME CLEAR: When user starts typing in a field that had an error,
     clear the error immediately. This gives instant feedback that they are fixing it. */
  nameInput.addEventListener('input', function () {
    clearError(nameInput, nameError);
  });

  emailInput.addEventListener('input', function () {
    clearError(emailInput, emailError);
  });

  phoneInput.addEventListener('input', function () {
    clearError(phoneInput, phoneError);
  });

  messageInput.addEventListener('input', function () {
    clearError(messageInput, messageError);
  });

}