document.addEventListener('DOMContentLoaded', () => {
            let summaryInfo = []; // Array to store summary information

            function checkExclusion() {
                const isPregnant = document.getElementById('pregnant').checked;
                const hasCatheter = document.getElementById('urinary_catheter').checked;
                const hasRecurrentUTI = document.getElementById('recurrent_uti').checked;
                return isPregnant || hasCatheter || hasRecurrentUTI;
            }

            function checkAnyChecked(checkboxes) {
                return Array.from(checkboxes).some(cb => cb.checked);
            }

            function toggleQuestionGroup(currentGroupId, nextGroupId) {
                const currentGroup = document.getElementById(currentGroupId);
                const nextGroup = document.getElementById(nextGroupId);

                if (currentGroup) {
                    currentGroup.classList.add('hidden');
                }
                if (nextGroup) {
                    nextGroup.classList.remove('hidden');
                }
            }

            function updateSummary(text) {
                // Replace newline characters (\n) with <br> tags
                text = text.replace(/\n/g, '<br/>');
                summaryInfo.push(text);
            }

            function displaySummary() {
                const summaryElement = document.getElementById('summary');
                if (summaryElement) {
                    // Clear previous summary content
                    summaryElement.innerHTML = '';

                    // Create an unordered list element
                    const ul = document.createElement('ul');

                    // Loop through summaryInfo and create list items with HTML content
                    summaryInfo.forEach(item => {
                        const li = document.createElement('li');
                        li.innerHTML = item; // Use innerHTML to render HTML content
                        ul.appendChild(li);
                    });

                    // Append the list to the summary element
                    summaryElement.appendChild(ul);
                }
            }

            // Initial Questions Group
            const nextButtonInitial = document.createElement('button');
            nextButtonInitial.innerText = 'Next';
            nextButtonInitial.type = 'button';
            nextButtonInitial.addEventListener('click', () => {
                if (checkExclusion()) {
                    alert('Patient is excluded from the UTI pathway.');
                } else {
                    toggleQuestionGroup('group_initial_questions', 'group_pyelonephritis_symptoms');
                }
            });
            document.getElementById('group_initial_questions').appendChild(nextButtonInitial);

            // Pyelonephritis Symptoms Group
            const nextButtonPyelo = document.createElement('button');
            nextButtonPyelo.innerText = 'Next';
            nextButtonPyelo.type = 'button';
            nextButtonPyelo.addEventListener('click', () => {
                const pyeloCheckboxes = document.querySelectorAll('#group_pyelonephritis_symptoms input[type="checkbox"]');
                if (checkAnyChecked(pyeloCheckboxes)) {
                    updateSummary('Urgent same day referral required:\n - General practice\n - Relevant out of hours service');
                    displaySummary();
                    toggleQuestionGroup('group_pyelonephritis_symptoms', 'group_applicable_for_all');
                } else {
                    Array.from(pyeloCheckboxes).forEach(cb => {
                        if (cb.checked) {
                            updateSummary(cb.nextElementSibling.textContent.trim());
                        }
                    });
                    toggleQuestionGroup('group_pyelonephritis_symptoms', 'group_additional_checks');
                }
            });
            document.getElementById('group_pyelonephritis_symptoms').appendChild(nextButtonPyelo);

            // Additional Checks Group
            const nextButtonAdditional = document.createElement('button');
            nextButtonAdditional.innerText = 'Next';
            nextButtonAdditional.type = 'button';
            nextButtonAdditional.addEventListener('click', () => {
                const additionalCheckboxes = document.querySelectorAll('#group_additional_checks input[type="checkbox"]');
                if (checkAnyChecked(additionalCheckboxes)) {
                    updateSummary('Onward referral:\n - General practice\n - Sexual health clinics\n - Other provider as appropriate');
                    displaySummary();
                    toggleQuestionGroup('group_additional_checks', 'group_applicable_for_all');
                } else {
                    Array.from(additionalCheckboxes).forEach(cb => {
                        if (cb.checked) {
                            updateSummary(cb.nextElementSibling.textContent.trim());
                        }
                    });
                    toggleQuestionGroup('group_additional_checks', 'group_key_diagnostic_signs');
                }
            });
            document.getElementById('group_additional_checks').appendChild(nextButtonAdditional);

            // Key Diagnostic Signs/Symptoms Group
            const nextButtonKeyDiagnostic = document.createElement('button');
            nextButtonKeyDiagnostic.innerText = 'Next';
            nextButtonKeyDiagnostic.type = 'button';
            nextButtonKeyDiagnostic.addEventListener('click', () => {
                const keyDiagnosticCheckboxes = document.querySelectorAll('#group_key_diagnostic_signs input[type="checkbox"]');
                const countChecked = Array.from(keyDiagnosticCheckboxes).filter(cb => cb.checked).length;
                if (countChecked >= 2) {
                    updateSummary('Shared decision making approach using TARGET UTI resources');
                    toggleQuestionGroup('group_key_diagnostic_signs', 'group_shared_decision_making');
                } else if (countChecked === 1) {
                    updateSummary('UTI equally likely to other diagnosis.');
                    displaySummary();
                    toggleQuestionGroup('group_key_diagnostic_signs', 'group_applicable_for_all');
                } else {
                    updateSummary('UTI less likely - Self-care and pain relief.');
                    displaySummary()
                    toggleQuestionGroup('group_key_diagnostic_signs', 'group_other_urinary_symptoms');
                }
            });
            document.getElementById('group_key_diagnostic_signs').appendChild(nextButtonKeyDiagnostic);

            // Other Urinary Symptoms Group
            const nextButtonOtherUrinary = document.createElement('button');
            nextButtonOtherUrinary.innerText = 'Next';
            nextButtonOtherUrinary.type = 'button';
            nextButtonOtherUrinary.addEventListener('click', () => {
                const otherUrinaryCheckboxes = document.querySelectorAll('#group_other_urinary_symptoms input[type="checkbox"]');
                if (checkAnyChecked(otherUrinaryCheckboxes)) {
                    updateSummary('UTI equally likely to other diagnosis.');
                    displaySummary();
                    toggleQuestionGroup('group_other_urinary_symptoms', 'group_applicable_for_all');
                } else {
                    updateSummary('UTI less likely - Self-care and pain relief.');
                    displaySummary()
                    toggleQuestionGroup('group_other_urinary_symptoms', 'group_applicable_for_all');
                }
                toggleQuestionGroup('group_other_urinary_symptoms', 'group_shared_decision_making');
            });
            document.getElementById('group_other_urinary_symptoms').appendChild(nextButtonOtherUrinary);

            // Shared Decision Making Group
            const nextButtonShared = document.createElement('button');
            nextButtonShared.innerText = 'Next';
            nextButtonShared.type = 'button';
            nextButtonShared.addEventListener('click', () => {
                const selectedOption = document.querySelector('input[name="decision_making"]:checked');
                if (selectedOption.value === 'mild') {
                    updateSummary('Ask patient to return to Pharmacy if no improvement in 48 hours for pharmacist reassessment');
                } else if (selectedOption.value === 'moderate_severe') {
                    updateSummary('Offer nitrofurantoin for 3 days (subject to inclusion/exclusion criteria in PGD) plus self-care');
                }
                displaySummary(); // Display the summary before showing the final group
                toggleQuestionGroup('group_shared_decision_making', 'group_applicable_for_all');
            });
            document.getElementById('group_shared_decision_making').appendChild(nextButtonShared);

            // Function to restart the form
            function restartForm() {
                // Reset all checkboxes and radio buttons to their initial state
                const form = document.getElementById("utiForm");
                form.reset();

                // Hide all question groups except the initial questions
                const questionGroups = document.querySelectorAll(".question-group");
                questionGroups.forEach(group => {
                    group.classList.add("hidden");
                });
                document.getElementById("group_initial_questions").classList.remove("hidden");

                // Clear the summary
                document.getElementById("summary").textContent = "";
                summaryInfo = [];
            }

            // Add an event listener to the "Restart" button
            const restartButton = document.getElementById("restartButton");
            restartButton.addEventListener("click", restartForm);

            // Form Submission
            document.getElementById('utiForm').addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(this);
                const data = {};
                formData.forEach((value, key) => {
                    data[key] = value === 'on';
                });

                fetch('http://localhost:8000/evaluate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('result').innerText = 'Result: ' + data.result;
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            });
        });