// Main JavaScript file for Automation Practice Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initForms();
    initTables();
    initWidgets();
    initAlerts();
    initDynamicContent();
    initAdvancedInteractions();
    initIframes();
    initModalWindow();
    setupIframeSection();
    setupAlertsSection();
    setupDynamicContentSection();
});

// Navigation Functions
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.classList.contains('active') && !this.parentElement.classList.contains('dropdown')) {
                document.querySelector('.nav-link.active').classList.remove('active');
                this.classList.add('active');
            }
        });
    });
}

// Form Functions
function initForms() {
    const registrationForm = document.getElementById('registration-form');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // Simulate form submission
            console.log('Form submitted:', {
                username,
                email,
                password
            });
            
            const successMessage = document.getElementById('successMessage');
            successMessage.textContent = 'Registration successful!';
            successMessage.style.color = 'green';
            successMessage.style.padding = '10px';
            successMessage.style.border = '1px solid green';
            this.reset();

            setTimeout(function() {
            successMessage.textContent = '';
            successMessage.style.color = '';
            successMessage.style.padding = '';
            successMessage.style.border = '';
            }, 3000);
        });
    }
}

function initTables() {
    const tableSearch = document.getElementById('table-search');
    const tableFilter = document.getElementById('table-filter');
    const tableHeaders = document.querySelectorAll('th[data-sort]');
    
    // Pagination variables
    const rowsPerPage = 5;
    let currentPage = 1;
    let filteredRows = [];
    
    // Get existing pagination elements
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    
    // Initialize pagination
    initPagination();
    
    if (tableSearch) {
        tableSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#user-table tbody tr');
            
            filteredRows = Array.from(rows).filter(row => {
                const text = row.textContent.toLowerCase();
                const matches = text.includes(searchTerm);
                return matches;
            });
            
            // Reset to first page when searching
            currentPage = 1;
            updatePagination();
        });
    }
    
    if (tableFilter) {
        tableFilter.addEventListener('change', function() {
            const filterValue = this.value;
            const rows = document.querySelectorAll('#user-table tbody tr');
            
            filteredRows = Array.from(rows).filter(row => {
                return filterValue === 'all' || row.getAttribute('data-department') === filterValue;
            });
            
            // Reset to first page when filtering
            currentPage = 1;
            updatePagination();
        });
    }
    
    if (tableHeaders) {
        tableHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const sortField = this.getAttribute('data-sort');
                const isAscending = this.classList.contains('asc');
                
                // Clear existing sort classes
                document.querySelectorAll('th[data-sort]').forEach(th => {
                    th.classList.remove('asc', 'desc');
                });
                
                // Set new sort class
                this.classList.add(isAscending ? 'desc' : 'asc');
                
                // Sort rows
                filteredRows.sort((a, b) => {
                    const aValue = a.querySelector(`td:nth-child(${getColumnIndex(sortField)})`).textContent;
                    const bValue = b.querySelector(`td:nth-child(${getColumnIndex(sortField)})`).textContent;
                    
                    if (sortField === 'id') {
                        return isAscending ? 
                            parseInt(bValue) - parseInt(aValue) : 
                            parseInt(aValue) - parseInt(bValue);
                    } else {
                        return isAscending ? 
                            bValue.localeCompare(aValue) : 
                            aValue.localeCompare(bValue);
                    }
                });
                
                updatePagination();
            });
        });
    }
    
    // Helper function to get column index
    function getColumnIndex(sortField) {
        const headers = document.querySelectorAll('#user-table th');
        for (let i = 0; i < headers.length; i++) {
            if (headers[i].getAttribute('data-sort') === sortField) {
                return i + 1;
            }
        }
        return 1;
    }
    
    // Table row actions
    function attachRowEventListeners() {
        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');
        
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                alert(`Edit user with ID: ${id}`);
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const confirmed = confirm(`Are you sure you want to delete user with ID: ${id}?`);
                
                if (confirmed) {
                    const row = this.closest('tr');
                    row.remove();
                    
                    // After removing a row, refresh pagination
                    initPagination();
                    alert(`User with ID: ${id} has been deleted`);
                }
            });
        });
    }
    
    // Pagination functions
    function initPagination() {
        const rows = document.querySelectorAll('#user-table tbody tr');
        filteredRows = Array.from(rows);
        
        // Add pagination event listeners
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    updatePagination();
                }
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updatePagination();
                }
            });
        }
        
        updatePagination();
    }
    
    function updatePagination() {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
        
        // Update page info text
        if (pageInfo) {
            pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
        }
        
        // Update button states
        if (prevButton) {
            prevButton.disabled = currentPage === 1;
        }
        
        if (nextButton) {
            nextButton.disabled = currentPage >= totalPages;
        }
        
        // Show only rows for current page
        const allRows = document.querySelectorAll('#user-table tbody tr');
        
        // Hide all rows first
        allRows.forEach(row => {
            row.style.display = 'none';
        });
        
        // Show only the rows for current page
        filteredRows.slice(startIndex, endIndex).forEach(row => {
            row.style.display = '';
        });
        
        // Reattach event listeners for visible rows
        attachRowEventListeners();
    }
}
// Widget Functions
// function initWidgets() {
//     initTabs();
//     initDatePicker();
//     initSlider();
//     initProgressBar();
//     initTooltips();
// }

// function initTabs() {
//     const tabButtons = document.querySelectorAll('.tab-button');
    
//     tabButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             const tabId = this.getAttribute('data-tab');
            
//             // Hide all tabs
//             document.querySelectorAll('.tab-content').forEach(tab => {
//                 tab.style.display = 'none';
//             });
            
//             // Remove active class from all buttons
//             document.querySelectorAll('.tab-button').forEach(btn => {
//                 btn.classList.remove('active');
//             });
            
//             // Show the selected tab
//             document.getElementById(tabId).style.display = 'block';
            
//             // Add active class to the clicked button
//             this.classList.add('active');
//         });
//     });
// }

// function initDatePicker() {
//     const datepicker = document.getElementById('datepicker');
//     const calendar = document.getElementById('datepicker-calendar');
    
//     if (datepicker && calendar) {
//         datepicker.addEventListener('click', function() {
//             calendar.style.display = calendar.style.display === 'block' ? 'none' : 'block';
            
//             // Generate calendar if it's empty
//             if (calendar.children.length === 0) {
//                 generateCalendar();
//             }
//         });
        
//         // Close calendar when clicking outside
//         document.addEventListener('click', function(e) {
//             if (!datepicker.contains(e.target) && !calendar.contains(e.target)) {
//                 calendar.style.display = 'none';
//             }
//         });
        
//         function generateCalendar() {
//             const date = new Date();
//             const year = date.getFullYear();
//             const month = date.getMonth();
            
//             const header = document.createElement('div');
//             header.className = 'datepicker-header';
            
//             const prevBtn = document.createElement('button');
//             prevBtn.textContent = '←';
//             prevBtn.addEventListener('click', function() {
//                 date.setMonth(date.getMonth() - 1);
//                 updateCalendar();
//             });
            
//             const nextBtn = document.createElement('button');
//             nextBtn.textContent = '→';
//             nextBtn.addEventListener('click', function() {
//                 date.setMonth(date.getMonth() + 1);
//                 updateCalendar();
//             });
            
//             const monthYear = document.createElement('span');
//             monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
            
//             header.appendChild(prevBtn);
//             header.appendChild(monthYear);
//             header.appendChild(nextBtn);
            
//             calendar.appendChild(header);
            
//             const daysGrid = document.createElement('div');
//             daysGrid.className = 'datepicker-grid';
            
//             // Add day names
//             const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
//             dayNames.forEach(day => {
//                 const dayElement = document.createElement('div');
//                 dayElement.textContent = day;
//                 dayElement.className = 'datepicker-day-name';
//                 daysGrid.appendChild(dayElement);
//             });
            
//             calendar.appendChild(daysGrid);
            
//             function updateCalendar() {
//                 monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
                
//                 // Clear previous days
//                 while (daysGrid.children.length > 7) {
//                     daysGrid.removeChild(daysGrid.lastChild);
//                 }
                
//                 // Get first day of month and number of days
//                 const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
//                 const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
//                 const daysInMonth = lastDay.getDate();
                
//                 // Add empty cells before first day
//                 for (let i = 0; i < firstDay.getDay(); i++) {
//                     const emptyDay = document.createElement('div');
//                     emptyDay.className = 'datepicker-day empty';
//                     daysGrid.appendChild(emptyDay);
//                 }
                
//                 // Add days of month
//                 for (let i = 1; i <= daysInMonth; i++) {
//                     const dayElement = document.createElement('div');
//                     dayElement.textContent = i;
//                     dayElement.className = 'datepicker-day';
                    
//                     const currentDate = new Date();
//                     if (i === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
//                         dayElement.classList.add('current');
//                     }
                    
//                     dayElement.addEventListener('click', function() {
//                         const selectedDate = new Date(date.getFullYear(), date.getMonth(), i);
//                         datepicker.value = selectedDate.toLocaleDateString();
//                         calendar.style.display = 'none';
//                     });
                    
//                     daysGrid.appendChild(dayElement);
//                 }
//             }
            
//             updateCalendar();
//         }
//     }
// }

// Your JavaScript file (e.g., slider.js)

// function initSlider() {
//     const slider = document.getElementById('slider');
//     const sliderValue = document.getElementById('slider-value');
//     const resetButton = document.getElementById('reset-slider');
    
//     // Check if elements exist
//     console.log("Slider:", slider);
//     console.log("Slider Value:", sliderValue);
//     console.log("Reset Button:", resetButton);
    
//     // Add event listener for slider input
//     slider.addEventListener('input', function() {
//         console.log("Slider value changed to:", this.value);
//         sliderValue.textContent = this.value;
//     });
    
//     // Add event listener for reset button
//     resetButton.addEventListener('click', function() {
//         console.log("Reset button clicked");
//         slider.value = 0;
//         sliderValue.textContent = "0";
//     });
// }

// Call the function when the page loads
// document.addEventListener('DOMContentLoaded', initSlider);


// function initProgressBar() {
//     const progressBar = document.getElementById('progress-bar');
//     const progressBtn = document.getElementById('progress-btn');
    
//     if (progressBar && progressBtn) {
//         // Make sure we only add one click listener
//         progressBtn.addEventListener('click', function() {
//             // Disable the button immediately to prevent multiple clicks
//             progressBtn.disabled = true;
//             progressBtn.textContent = 'Loading... 0%';
            
//             // Reset the progress bar width
//             progressBar.style.width = '0%';
            
//             let width = 0;
//             // Use requestAnimationFrame instead of setInterval for smoother animation
//             function updateProgress() {
//                 if (width >= 100) {
//                     progressBtn.textContent = 'Complete!';
//                 } else {
//                     width += 1; // Smaller increments for smoother animation
//                     progressBar.style.width = width + '%';
//                     progressBtn.textContent = `Loading... ${width}%`;
//                     // Request the next frame
//                     setTimeout(updateProgress, 50); // 20 updates per second is smoother
//                 }
//             }
            
            // Start the animation
            //updateProgress();
//         });
//     }
// }

// function initTooltips() {
//     const tooltips = document.querySelectorAll('.tooltip');
    
//     tooltips.forEach(tooltip => {
//         const text = tooltip.getAttribute('data-tooltip');
//         if (text) {
//             const tooltipText = document.createElement('span');
//             tooltipText.className = 'tooltip-text';
//             tooltipText.textContent = text;
//             tooltip.appendChild(tooltipText);
            
//             // Add data attributes for automation testing
//             tooltipText.setAttribute('data-testid', 'tooltip-content');
//             tooltipText.setAttribute('aria-hidden', 'true');
            
//             // Add hover event listeners
//             tooltip.addEventListener('mouseenter', function() {
//                 tooltipText.style.visibility = 'visible';
//                 tooltipText.style.opacity = '1';
                
//                 // Update attribute for automation testing
//                 tooltipText.setAttribute('data-visible', 'true');
//             });
            
//             tooltip.addEventListener('mouseleave', function() {
//                 tooltipText.style.visibility = 'hidden';
//                 tooltipText.style.opacity = '0';
                
//                 // Update attribute for automation testing
//                 tooltipText.setAttribute('data-visible', 'false');
//             });
//         }
//     });
// }

// // Alerts Functions
// function initAlerts() {
//     const alertButtons = {
//         'alert-btn': function() {
//             alert('This is a simple alert!');
//         },
//         'confirm-btn': function() {
//             const confirmed = confirm('Are you sure you want to proceed?');
//             if (confirmed) {
//                 alert('You confirmed the action!');
//             } else {
//                 alert('You canceled the action!');
//             }
//         },
//         // 'prompt-btn': function() {
//         //     const name = prompt('Please enter your name:', '');
//         //     if (name !== null) {
//         //         alert(`Hello, ${name}!`);
//         //     }
//         // }
//     };
    
//     Object.keys(alertButtons).forEach(id => {
//         const button = document.getElementById(id);
//         if (button) {
//             button.addEventListener('click', alertButtons[id]);
//         }
//     });
// }

// Dynamic Content Functions
function initDynamicContent() {
    const loadContentBtn = document.getElementById('load-content-btn');
    const dynamicContent = document.getElementById('dynamic-content');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    if (loadContentBtn && dynamicContent) {
        loadContentBtn.addEventListener('click', function() {
            // Show loading indicator
            if (loadingIndicator) {
                loadingIndicator.style.display = 'block';
            }
            
            // Simulate loading delay
            setTimeout(function() {
                // Generate random content
                const content = generateRandomContent();
                
                // Update dynamic content area
                dynamicContent.innerHTML = content;
                
                // Hide loading indicator
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
                
                // Initialize any new components in the dynamic content
                initDynamicComponents();
            }, 1500);
        });
    }
    
    function generateRandomContent() {
        const contents = [
            `<h3>New User Data</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>101</td>
                        <td>Sarah Connor</td>
                        <td>sarah.connor@example.com</td>
                        <td><button class="btn btn-sm dynamic-btn">View</button></td>
                    </tr>
                    <tr>
                        <td>102</td>
                        <td>John Wick</td>
                        <td>john.wick@example.com</td>
                        <td><button class="btn btn-sm dynamic-btn">View</button></td>
                    </tr>
                </tbody>
            </table>`,
            
            `<h3>Notification Center</h3>
            <div class="notification-list">
                <div class="notification">
                    <h4>System Update</h4>
                    <p>A new system update is available. Please refresh your browser.</p>
                    <button class="btn btn-sm dynamic-btn">Refresh</button>
                </div>
                <div class="notification">
                    <h4>New Message</h4>
                    <p>You have 3 unread messages in your inbox.</p>
      <button class="btn btn-sm dynamic-btn">View Messages</button>
                </div>
            </div>`,
            
            `<h3>Activity Graph</h3>
            <div class="graph-container">
                <canvas id="dynamic-graph" width="400" height="200"></canvas>
                <div class="graph-legend">
                    <div class="legend-item">
                        <span class="legend-color" style="background-color: #3498db;"></span>
                        <span>Visits</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color" style="background-color: #2ecc71;"></span>
                        <span>Conversions</span>
                    </div>
                </div>
                <button class="btn btn-sm dynamic-btn">Refresh Data</button>
            </div>`
        ];
        
        // Return a random content item
        return contents[Math.floor(Math.random() * contents.length)];
    }
}

// Initialize any additional components when the page loads or when dynamic content is added
function initDynamicComponents() {
    // Initialize dynamic buttons
    const dynamicButtons = document.querySelectorAll('.dynamic-btn');
    dynamicButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Dynamic button clicked: ' + this.textContent);
        });
    });
    
    // Initialize dynamic graph if it exists
    const dynamicGraph = document.getElementById('dynamic-graph');
    if (dynamicGraph) {
        const ctx = dynamicGraph.getContext('2d');
        
        // Draw simple graph
        ctx.beginPath();
        ctx.moveTo(0, 150);
        ctx.lineTo(50, 100);
        ctx.lineTo(100, 120);
        ctx.lineTo(150, 80);
        ctx.lineTo(200, 90);
        ctx.lineTo(250, 60);
        ctx.lineTo(300, 70);
        ctx.lineTo(350, 40);
        ctx.lineTo(400, 50);
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw second line
        ctx.beginPath();
        ctx.moveTo(0, 180);
        ctx.lineTo(50, 160);
        ctx.lineTo(100, 170);
        ctx.lineTo(150, 140);
        ctx.lineTo(200, 150);
        ctx.lineTo(250, 130);
        ctx.lineTo(300, 140);
        ctx.lineTo(350, 120);
        ctx.lineTo(400, 130);
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

// Advanced Interactions
function initAdvancedInteractions() {
    initDragAndDrop();
    initAccordion();
    initFileUpload();
    initColorPicker();
}

function initDragAndDrop() {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZone = document.getElementById('drop-zone');
    const draggables = document.querySelectorAll('.draggable');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    // Set up event listeners for drag items
    dragItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.id);
            this.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    // Set up event listeners for drop zone
    if (dropZone) {
        // Allow drop by preventing default
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        // Remove visual indicator when leaving drop zone
        dropZone.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        // Handle the drop event
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            // Get the dragged item id and element
            const id = e.dataTransfer.getData('text/plain');
            const draggedItem = document.getElementById(id);
            
            // Move the item to the drop zone if it exists
            if (draggedItem) {
                this.appendChild(draggedItem);
                
                // Clear the placeholder text if this is the first item
                if (this.textContent.trim() === 'Drop items here' && this.childElementCount === 1) {
                    this.textContent = '';
                    this.appendChild(draggedItem);
                }
            }
        });
    }
    
    // Set up event listeners for draggable elements
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.id);
            this.classList.add('dragging');
        });
        
        draggable.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    // Set up event listeners for drop zones
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            const id = e.dataTransfer.getData('text/plain');
            const draggable = document.getElementById(id);
            
            // Append the draggable element to the drop zone
            if (draggable) {
                this.appendChild(draggable);
            }
        });
    });
}

function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

function initFileUpload() {
    const fileInput = document.getElementById('profile-pic');
    const fileLabel = document.querySelector('label[for="profile-pic"]');
    
    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileLabel.textContent = 'File selected: ' + this.files[0].name;
            } else {
                fileLabel.textContent = 'Profile Picture:';
            }
        });
    }
}

function initColorPicker() {
    const colorPicker = document.getElementById('color-picker');
    const colorDisplay = document.getElementById('color-display');
    
    if (colorPicker && colorDisplay) {
        colorPicker.addEventListener('input', function() {
            colorDisplay.style.backgroundColor = this.value;
            colorDisplay.textContent = this.value;
        });
    }
}

// // Iframe Functions
// function initIframes() {
//     const iframeToggle = document.getElementById('iframe-toggle');
//     const iframeContent = document.getElementById('iframe-content');
    
//     if (iframeToggle && iframeContent) {
//         iframeToggle.addEventListener('click', function() {
//             if (iframeContent.style.display === 'none') {
//                 iframeContent.style.display = 'block';
//                 this.textContent = 'Hide iFrame';
//             } else {
//                 iframeContent.style.display = 'none';
//                 this.textContent = 'Show iFrame';
//             }
//         });
//     }
    
//     // Communication between iframe and parent
//     window.addEventListener('message', function(event) {
//         if (event.data.type === 'iframeMessage') {
//             alert('Message from iframe: ' + event.data.message);
//         }
//     });
// }

// Modal Window functionality
// Make sure this is in a <script> tag
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded'); // Add this to check if script loads at all
    initModalWindow();
});

function initModalWindow() {
    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('open-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const confirmBtn = document.getElementById('modal-confirm');
    
    //console.log('Modal elements:', modal, openModalBtn); 
    //console.log("Button found", openModalBtn);// Debug check
    
    // Open modal when button is clicked
    openModalBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
        console.log('Opening modal');
    });
    
    // Close modal when close button is clicked
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when confirm button is clicked
    confirmBtn.addEventListener('click', function() {
        alert('Action confirmed!');
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}


// ======= IFRAME SECTION =======
// Combined iframe functionality
// This is our main function that sets up everything
function setupIframes() {
    // First, we find all the buttons and screens we need
    const hideShowButton = document.getElementById('iframe-toggle');
    const iframeBox = document.getElementById('iframe-content');
    const sendMessageButton = document.getElementById('iframe-btn');
    const ourIframe = document.getElementById('practice-iframe');
    
    // This makes the hide/show button work
    if (hideShowButton && iframeBox) {
        hideShowButton.addEventListener('click', function() {
            // If the iframe is hidden, show it
            if (iframeBox.style.display === 'none') {
                iframeBox.style.display = 'block';
                this.textContent = 'Hide iFrame';
            } 
            // If the iframe is showing, hide it
            else {
                iframeBox.style.display = 'none';
                this.textContent = 'Show iFrame';
            }
        });
    }
    
    // This makes the send message button work
    if (sendMessageButton && ourIframe) {
        sendMessageButton.addEventListener('click', function() {
            try {
                // This sends a friendly hello message to the iframe
                ourIframe.contentWindow.postMessage({
                    message: 'Hello from the parent page!'
                }, '*');
                // This tells us the message was sent
                alert('Message sent to iframe!');
            } catch (error) {
                // This tells us if something went wrong
                alert('Could not send message: ' + error.message);
            }
        });
    }
    
    // This listens for any messages coming from the iframe
    window.addEventListener('message', function(event) {
        if (event.data && event.data.message) {
            // When the iframe sends a message, show it in a popup
            alert('Message from iframe: ' + event.data.message);
        }
    });
}

// Run our function when the page is fully loaded
document.addEventListener('DOMContentLoaded', setupIframes);

// ======= ALERTS SECTION =======
function setupAlertsSection() {
    // Find all our buttons
    const alertBtn = document.getElementById('alert-btn');
    const confirmBtn = document.getElementById('confirm-btn');
    const promptBtn = document.getElementById('prompt-btn');
    
    // Find where we'll show our results
    const alertResult = document.getElementById('alert-result');
    
    // Setup the regular alert button
    if (alertBtn) {
        alertBtn.addEventListener('click', function() {
            // Show a simple alert popup
            alert('This is a simple alert message!');
            
            // Update the result text
            if (alertResult) {
                alertResult.textContent = 'Alert was shown';
            }
        });
    }
    
    // Setup the confirm button
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            // Show a confirm dialog (with OK and Cancel buttons)
            const userChoice = confirm('Do you want to proceed?');
            
            // Update the result based on what the user clicked
            if (alertResult) {
                if (userChoice) {
                    alertResult.textContent = 'User clicked OK';
                } else {
                    alertResult.textContent = 'User clicked Cancel';
                }
            }
        });
    }
    
    // Setup the prompt button
    if (promptBtn) {
        promptBtn.addEventListener('click', function() {
            // Show a prompt dialog where the user can type something
            const userInput = prompt('Please enter your name:', '');
            
            // Update the result based on what the user entered
            if (alertResult) {
                if (userInput === null) {
                    alertResult.textContent = 'User canceled the prompt';
                } else if (userInput === '') {
                    alertResult.textContent = 'User didn\'t enter anything';
                } else {
                    alertResult.textContent = 'User entered: ' + userInput;
                }
            }
        });
    }
}

// Make sure to call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    setupAlertsSection();
});

// ======= DYNAMIC CONTENT SECTION =======
function setupDynamicContentSection() {
    // Find our buttons
    const loadDataBtn = document.getElementById('load-data-btn');
    const delayedBtn = document.getElementById('delayed-btn');
    
    // Find where we'll put our content
    const dynamicContent = document.getElementById('dynamic-content');
    const delayedContainer = document.getElementById('delayed-container');
    
    // Setup the load data button
    if (loadDataBtn && dynamicContent) {
        loadDataBtn.addEventListener('click', function() {
            // Show loading text while we wait
            dynamicContent.innerHTML = '<p>Loading data...</p>';
            
            // Pretend we're getting data from a server (this takes 2 seconds)
            setTimeout(function() {
                // Create some fake data (in a real app, this would come from a server)
                const data = [
                    { name: 'Alice', age: 25, city: 'New York' },
                    { name: 'Bob', age: 30, city: 'Chicago' },
                    { name: 'Charlie', age: 22, city: 'Los Angeles' }
                ];
                
                // Make a nice HTML table from our data
                let tableHTML = `
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>City</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                // Add a row for each person in our data
                data.forEach(function(person) {
                    tableHTML += `
                        <tr>
                            <td>${person.name}</td>
                            <td>${person.age}</td>
                            <td>${person.city}</td>
                        </tr>
                    `;
                });
                
                // Finish our table
                tableHTML += `
                        </tbody>
                    </table>
                `;
                
                // Put the table in our page
                dynamicContent.innerHTML = tableHTML;
            }, 2000); // Wait 2 seconds (2000 milliseconds)
        });
    }
    
    // Setup the delayed button
    if (delayedBtn && delayedContainer) {
        delayedBtn.addEventListener('click', function() {
            // Disable the button so it can't be clicked again
            delayedBtn.disabled = true;
            delayedBtn.textContent = 'Loading...';
            
            // Wait 3 seconds before showing the element
            setTimeout(function() {
                // Create a colorful message that wasn't there before
                const delayedElement = document.createElement('div');
                delayedElement.className = 'delayed-message';
                delayedElement.style.backgroundColor = '#ffeb3b';
                delayedElement.style.padding = '15px';
                delayedElement.style.marginTop = '10px';
                delayedElement.style.borderRadius = '5px';
                delayedElement.innerHTML = `
                    <h4>Surprise Element!</h4>
                    <p>This element appeared after a 3-second delay.</p>
                    <button id="remove-delayed">Remove Me</button>
                `;
                
                // Add it to the page
                delayedContainer.appendChild(delayedElement);
                
                // Reset the button
                delayedBtn.disabled = false;
                delayedBtn.textContent = 'Show Delayed Element';
                
                // Make the "Remove Me" button work
                document.getElementById('remove-delayed').addEventListener('click', function() {
                    delayedContainer.removeChild(delayedElement);
                });
            }, 3000); // Wait 3 seconds (3000 milliseconds)
        });
    }
}