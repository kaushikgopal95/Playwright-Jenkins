// Main JavaScript file for Automation Practice Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initForms();
    initTables();
    //initWidgets();
    initAlerts();
    initDynamicContent();
    //initFuturisticComponents();
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
                document.querySelector('.nav-link.active')?.classList.remove('active');
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
            if (successMessage) {
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
            }
        });
    }
}




// Table Functions
function initTables() {
    const tableSearch = document.getElementById('table-search');
    const tableFilter = document.getElementById('table-filter');
    const tableHeaders = document.querySelectorAll('th[data-sort]');
    const userTable = document.getElementById('user-table');
    
    if (!userTable) return; // Exit if table doesn't exist
    
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
                return text.includes(searchTerm);
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
    
    if (tableHeaders && tableHeaders.length > 0) {
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
                    const colIndex = getColumnIndex(sortField);
                    if (colIndex < 1) return 0;
                    
                    const aValue = a.querySelector(`td:nth-child(${colIndex})`).textContent;
                    const bValue = b.querySelector(`td:nth-child(${colIndex})`).textContent;
                    
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


// Advanced Interactions
document.addEventListener('DOMContentLoaded', function() {
            const dragItems = document.querySelectorAll('.futuristic-drag-item');
            const dropZone = document.getElementById('futuristic-drop-zone');
            const dropZoneEmpty = document.querySelector('.futuristic-drop-zone-empty');
            
            let draggedItem = null;
            
            // Add event listeners to draggable items
            dragItems.forEach(item => {
                item.addEventListener('dragstart', function() {
                    draggedItem = this;
                    setTimeout(() => {
                        this.classList.add('dragging');
                    }, 0);
                });
                
                item.addEventListener('dragend', function() {
                    this.classList.remove('dragging');
                });
            });
            
            // Add event listeners to drop zone
            dropZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });
            
            dropZone.addEventListener('dragleave', function() {
                this.classList.remove('drag-over');
            });
            
            dropZone.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
                
                if (draggedItem) {
                    const droppedItemId = draggedItem.id;
                    const itemExists = document.querySelector(`#${droppedItemId}-dropped`);
                    
                    if (!itemExists) {
                        // Hide empty state if this is the first item
                        if (dropZone.querySelectorAll('.futuristic-drag-item').length === 0) {
                            dropZoneEmpty.style.display = 'none';
                        }
                        
                        // Clone the item and add to drop zone
                        const clone = draggedItem.cloneNode(true);
                        clone.id = `${droppedItemId}-dropped`;
                        clone.classList.add('drop-animation');
                        clone.setAttribute('draggable', 'false');
                        
                        dropZone.appendChild(clone);
                    }
                }
            });
            
            // Modal Functionality
            const modal = document.getElementById('futuristic-modal');
            const openModalBtn = document.getElementById('futuristic-open-modal');
            const closeModalBtn = document.querySelector('.futuristic-close-modal');
            const confirmBtn = document.getElementById('futuristic-modal-confirm');
            
            openModalBtn.addEventListener('click', function() {
                modal.style.display = 'flex';
            });
            
            closeModalBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            confirmBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                // You can add confirmation handling here
            });
            
            window.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
            
            // Accordion Functionality
            const accordionHeaders = document.querySelectorAll('.custom-accordion-header');
            
            accordionHeaders.forEach(header => {
                header.addEventListener('click', function() {
                    this.classList.toggle('active');
                    const content = this.nextElementSibling;
                    
                    if (content.classList.contains('active')) {
                        content.classList.remove('active');
                    } else {
                        content.classList.add('active');
                    }
                });
            });
        });
// Dynamic Content Functions
function setupDynamicContentSection() {
    const elements = {
        loadDataBtn: document.getElementById('load-data-btn'),
        delayedBtn: document.getElementById('delayed-btn'),
        dynamicContent: document.getElementById('dynamic-content'),
        delayedContainer: document.getElementById('delayed-container')
    };
    
    if (elements.loadDataBtn && elements.dynamicContent) {
        elements.loadDataBtn.addEventListener('click', () => loadDynamicData(elements.dynamicContent));
    }
    
    if (elements.delayedBtn && elements.delayedContainer) {
        elements.delayedBtn.addEventListener('click', () => showDelayedElement(elements));
    }
}

function loadDynamicData(container) {
    container.innerHTML = '<p>Loading data...</p>';
    
    setTimeout(() => {
        const data = [
            { name: 'Alice', age: 25, city: 'New York' },
            { name: 'Bob', age: 30, city: 'Chicago' },
            { name: 'Charlie', age: 22, city: 'Los Angeles' }
        ];
        container.innerHTML = generateTableHTML(data);
    }, 2000);
}

function generateTableHTML(data) {
    return `
        <table border="1">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>City</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(person => `
                    <tr>
                        <td>${person.name}</td>
                        <td>${person.age}</td>
                        <td>${person.city}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showDelayedElement(elements) {
    elements.delayedBtn.disabled = true;
    elements.delayedBtn.textContent = 'Loading...';
    
    setTimeout(() => {
        const delayedElement = document.createElement('div');
        delayedElement.className = 'delayed-message';
        delayedElement.style.cssText = 'background-color: #ffeb3b; padding: 15px; margin-top: 10px; border-radius: 5px;';
        delayedElement.innerHTML = `
            <h4>Surprise Element!</h4>
            <p>This element appeared after a 3-second delay.</p>
            <button id="remove-delayed">Remove Me</button>
        `;
        
        elements.delayedContainer.appendChild(delayedElement);
        elements.delayedBtn.disabled = false;
        elements.delayedBtn.textContent = 'Show Delayed Element';
        
        document.getElementById('remove-delayed')?.addEventListener('click', () => {
            elements.delayedContainer.removeChild(delayedElement);
        });
    }, 3000);
}

// IFrame Section
function setupIframeSection() {
    const iframeElements = {
        toggle: document.getElementById('iframe-toggle'),
        content: document.getElementById('iframe-content'),
        sendBtn: document.getElementById('iframe-btn'),
        frame: document.getElementById('practice-iframe')
    };
    
    if (iframeElements.toggle && iframeElements.content) {
        iframeElements.toggle.addEventListener('click', () => {
            const isVisible = iframeElements.content.style.display !== 'none';
            iframeElements.content.style.display = isVisible ? 'none' : 'block';
            iframeElements.toggle.textContent = isVisible ? 'Show iFrame' : 'Hide iFrame';
        });
    }
    
    if (iframeElements.sendBtn && iframeElements.frame) {
        iframeElements.sendBtn.addEventListener('click', () => {
            try {
                iframeElements.frame.contentWindow.postMessage({
                    message: 'Hello from the parent page!'
                }, '*');
                alert('Message sent to iframe!');
            } catch (error) {
                alert('Could not send message: ' + error.message);
            }
        });
    }
    
    window.addEventListener('message', (event) => {
        if (event.data?.message) {
            alert('Message from iframe: ' + event.data.message);
        }
    });
}

// Alerts Section
function setupAlertsSection() {
    const alertButtons = {
        'alert-btn': () => alert('This is a simple alert!'),
        'confirm-btn': () => {
            const confirmed = confirm('Are you sure you want to proceed?');
            alert(confirmed ? 'You confirmed the action!' : 'You canceled the action!');
        },
        'prompt-btn': () => {
            const name = prompt('Please enter your name:', '');
            if (name !== null) alert(`Hello, ${name}!`);
        }
    };
    
    Object.entries(alertButtons).forEach(([id, handler]) => {
        document.getElementById(id)?.addEventListener('click', handler);
    });
}

// ... previous code ...

// Helper Functions for Drag and Drop
function initDragAndDrop() {
    const dragElements = {
        items: document.querySelectorAll('.draggable'),
        dropZones: document.querySelectorAll('.drop-zone')
    };
    
    dragElements.items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });
    
    dragElements.dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
}

// File Upload Functions
// function initFileUpload() {
//     const fileInput = document.getElementById('profile-pic');
//     const fileLabel = document.querySelector('label[for="profile-pic"]');
    
//     if (fileInput && fileLabel) {
//         fileInput.addEventListener('change', function() {
//             fileLabel.textContent = this.files.length > 0 
//                 ? 'File selected: ' + this.files[0].name 
//                 : 'Profile Picture:';
//         });
//     }
// }

// Color Picker Functions
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

// Accordion Functions
// function initCustomAccordion() {
//             document.querySelectorAll('#custom-accordion .custom-accordion-header').forEach(header => {
//                 header.addEventListener('click', function() {
//                     this.classList.toggle('active');
//                     const content = this.nextElementSibling;
//                     if (content.style.maxHeight) {
//                         content.style.maxHeight = null;
//                         content.style.padding = "0 20px";
//                     } else {
//                         content.style.maxHeight = content.scrollHeight + 'px';
//                         content.style.padding = "15px 20px";
//                     }
//                 });
//             });
//         }
//         document.addEventListener("DOMContentLoaded", initCustomAccordion);

// Event Listener for Messages from iFrame
window.addEventListener('message', function(event) {
    if (event.data?.type === 'iframeMessage') {
        alert('Message from iframe: ' + event.data.message);
    }
});

// Modal Window Functionality
function initModalWindow() {
    const modalElements = {
        modal: document.getElementById("modal"),
        openBtn: document.getElementById("open-modal"),
        closeBtn: document.querySelector(".close-modal"),
        confirmBtn: document.getElementById('modal-confirm')
    };
    
    if (!modalElements.modal) return;
    
    modalElements.modal.style.display = "none";
    
    const toggleModal = (show) => {
        modalElements.modal.style.display = show ? "flex" : "none";
    };
    
    modalElements.openBtn?.addEventListener("click", () => toggleModal(true));
    modalElements.closeBtn?.addEventListener("click", () => toggleModal(false));
    modalElements.confirmBtn?.addEventListener('click', () => {
        alert('Action confirmed!');
        toggleModal(false);
    });
    
    window.addEventListener("click", (e) => {
        if (e.target === modalElements.modal) toggleModal(false);
    });
}

// IFrame Section
function setupIframes() {
    const iframeElements = {
        toggle: document.getElementById('iframe-toggle'),
        content: document.getElementById('iframe-content'),
        sendBtn: document.getElementById('iframe-btn'),
        frame: document.getElementById('practice-iframe')
    };
    
    if (iframeElements.toggle && iframeElements.content) {
        iframeElements.toggle.addEventListener('click', () => {
            const isVisible = iframeElements.content.style.display !== 'none';
            iframeElements.content.style.display = isVisible ? 'none' : 'block';
            iframeElements.toggle.textContent = isVisible ? 'Show iFrame' : 'Hide iFrame';
        });
    }
    
    if (iframeElements.sendBtn && iframeElements.frame) {
        iframeElements.sendBtn.addEventListener('click', () => {
            try {
                iframeElements.frame.contentWindow.postMessage({
                    message: 'Hello from the parent page!'
                }, '*');
                alert('Message sent to iframe!');
            } catch (error) {
                alert('Could not send message: ' + error.message);
            }
        });
    }
    
    window.addEventListener('message', (event) => {
        if (event.data?.message) {
            alert('Message from iframe: ' + event.data.message);
        }
    });
}

// Alerts Section
function setupAlertsSection() {
    const elements = {
        alertBtn: document.getElementById('alert-btn'),
        confirmBtn: document.getElementById('confirm-btn'),
        promptBtn: document.getElementById('prompt-btn'),
        resultDisplay: document.getElementById('alert-result')
    };
    
    const updateResult = (message) => {
        if (elements.resultDisplay) {
            elements.resultDisplay.textContent = message;
        }
    };
    
    const alertHandlers = {
        'alert-btn': () => {
            alert('This is a simple alert message!');
            updateResult('Alert was shown');
        },
        'confirm-btn': () => {
            const userChoice = confirm('Do you want to proceed?');
            updateResult(userChoice ? 'User clicked OK' : 'User clicked Cancel');
        },
        'prompt-btn': () => {
            const userInput = prompt('Please enter your name:', '');
            if (userInput === null) {
                updateResult('User canceled the prompt');
            } else if (userInput === '') {
                updateResult('User didn\'t enter anything');
            } else {
                updateResult('User entered: ' + userInput);
            }
        }
    };
    
    Object.entries(alertHandlers).forEach(([id, handler]) => {
        document.getElementById(id)?.addEventListener('click', handler);
    });
}

// Dynamic Content Section
function setupDynamicContentSection() {
    const elements = {
        loadDataBtn: document.getElementById('load-data-btn'),
        delayedBtn: document.getElementById('delayed-btn'),
        dynamicContent: document.getElementById('dynamic-content'),
        delayedContainer: document.getElementById('delayed-container')
    };
    
    if (elements.loadDataBtn && elements.dynamicContent) {
        elements.loadDataBtn.addEventListener('click', () => loadDynamicData(elements.dynamicContent));
    }
    
    if (elements.delayedBtn && elements.delayedContainer) {
        elements.delayedBtn.addEventListener('click', () => showDelayedElement(elements));
    }
}

function loadDynamicData(container) {
    container.innerHTML = '<p>Loading data...</p>';
    
    setTimeout(() => {
        const data = [
            { name: 'Alice', age: 25, city: 'New York' },
            { name: 'Bob', age: 30, city: 'Chicago' },
            { name: 'Charlie', age: 22, city: 'Los Angeles' }
        ];
        container.innerHTML = generateTableHTML(data);
    }, 2000);
}

function generateTableHTML(data) {
    return `
        <table border="1">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>City</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(person => `
                    <tr>
                        <td>${person.name}</td>
                        <td>${person.age}</td>
                        <td>${person.city}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showDelayedElement(elements) {
    elements.delayedBtn.disabled = true;
    elements.delayedBtn.textContent = 'Loading...';
    
    setTimeout(() => {
        const delayedElement = document.createElement('div');
        delayedElement.className = 'delayed-message';
        delayedElement.innerHTML = `
            <h4>Delayed Content</h4>
            <p>This content appeared after a delay.</p>
            <button onclick="this.parentElement.remove()">Close</button>
        `;
        
        elements.delayedContainer.appendChild(delayedElement);
        elements.delayedBtn.disabled = false;
        elements.delayedBtn.textContent = 'Show Delayed Element';
    }, 3000);
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initModalWindow();
    setupIframes();
    setupAlertsSection();
    setupDynamicContentSection();
});