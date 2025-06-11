// IP Subnet Calculator with Magic Number Method - Enhanced for 1, 2, 3 Octet Masks
class SubnetCalculator {
    constructor() {
        this.cidrChart = [
            // 1-Octet Masks
            {"cidr": "/8", "mask": "255.0.0.0", "wildcard": "0.255.255.255", "hosts": "16777214", "magic_number": "N/A", "type": "1-octet"},
            {"cidr": "/9", "mask": "255.128.0.0", "wildcard": "0.127.255.255", "hosts": "8388606", "magic_number": "128", "type": "1-octet"},
            {"cidr": "/10", "mask": "255.192.0.0", "wildcard": "0.63.255.255", "hosts": "4194302", "magic_number": "64", "type": "1-octet"},
            {"cidr": "/11", "mask": "255.224.0.0", "wildcard": "0.31.255.255", "hosts": "2097150", "magic_number": "32", "type": "1-octet"},
            {"cidr": "/12", "mask": "255.240.0.0", "wildcard": "0.15.255.255", "hosts": "1048574", "magic_number": "16", "type": "1-octet"},
            {"cidr": "/13", "mask": "255.248.0.0", "wildcard": "0.7.255.255", "hosts": "524286", "magic_number": "8", "type": "1-octet"},
            {"cidr": "/14", "mask": "255.252.0.0", "wildcard": "0.3.255.255", "hosts": "262142", "magic_number": "4", "type": "1-octet"},
            {"cidr": "/15", "mask": "255.254.0.0", "wildcard": "0.1.255.255", "hosts": "131070", "magic_number": "2", "type": "1-octet"},
            
            // 2-Octet Masks
            {"cidr": "/16", "mask": "255.255.0.0", "wildcard": "0.0.255.255", "hosts": "65534", "magic_number": "N/A", "type": "2-octet"},
            {"cidr": "/17", "mask": "255.255.128.0", "wildcard": "0.0.127.255", "hosts": "32766", "magic_number": "128", "type": "2-octet"},
            {"cidr": "/18", "mask": "255.255.192.0", "wildcard": "0.0.63.255", "hosts": "16382", "magic_number": "64", "type": "2-octet"},
            {"cidr": "/19", "mask": "255.255.224.0", "wildcard": "0.0.31.255", "hosts": "8190", "magic_number": "32", "type": "2-octet"},
            {"cidr": "/20", "mask": "255.255.240.0", "wildcard": "0.0.15.255", "hosts": "4094", "magic_number": "16", "type": "2-octet"},
            {"cidr": "/21", "mask": "255.255.248.0", "wildcard": "0.0.7.255", "hosts": "2046", "magic_number": "8", "type": "2-octet"},
            {"cidr": "/22", "mask": "255.255.252.0", "wildcard": "0.0.3.255", "hosts": "1022", "magic_number": "4", "type": "2-octet"},
            {"cidr": "/23", "mask": "255.255.254.0", "wildcard": "0.0.1.255", "hosts": "510", "magic_number": "2", "type": "2-octet"},
            
            // 3-Octet Masks
            {"cidr": "/24", "mask": "255.255.255.0", "wildcard": "0.0.0.255", "hosts": "254", "magic_number": "N/A", "type": "3-octet"},
            {"cidr": "/25", "mask": "255.255.255.128", "wildcard": "0.0.0.127", "hosts": "126", "magic_number": "128", "type": "3-octet"},
            {"cidr": "/26", "mask": "255.255.255.192", "wildcard": "0.0.0.63", "hosts": "62", "magic_number": "64", "type": "3-octet"},
            {"cidr": "/27", "mask": "255.255.255.224", "wildcard": "0.0.0.31", "hosts": "30", "magic_number": "32", "type": "3-octet"},
            {"cidr": "/28", "mask": "255.255.255.240", "wildcard": "0.0.0.15", "hosts": "14", "magic_number": "16", "type": "3-octet"},
            {"cidr": "/29", "mask": "255.255.255.248", "wildcard": "0.0.0.7", "hosts": "6", "magic_number": "8", "type": "3-octet"},
            {"cidr": "/30", "mask": "255.255.255.252", "wildcard": "0.0.0.3", "hosts": "2", "magic_number": "4", "type": "3-octet"}
        ];

        this.difficultyRanges = {
            "class-a": {"cidr_min": 8, "cidr_max": 15, "type": "1-octet"},
            "class-b": {"cidr_min": 16, "cidr_max": 23, "type": "2-octet"},
            "class-c": {"cidr_min": 24, "cidr_max": 30, "type": "3-octet"},
            "all": {"cidr_min": 8, "cidr_max": 30, "type": "all"}
        };

        this.score = 0;
        this.totalAttempts = 0;
        this.currentProblem = null;
        this.currentFilter = 'all';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateCidrTable();
        this.showDefaultCalculation();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Calculator
        document.getElementById('calculate-btn').addEventListener('click', () => this.calculate());
        document.getElementById('ip-address').addEventListener('input', () => this.calculate());
        document.getElementById('subnet-mask').addEventListener('input', () => this.calculate());

        // Practice mode
        document.getElementById('new-problem-btn').addEventListener('click', () => this.generateNewProblem());
        document.getElementById('check-answers-btn').addEventListener('click', () => this.checkAnswers());
        document.getElementById('difficulty-select').addEventListener('change', () => this.generateNewProblem());

        // Mask type filter for reference table
        document.querySelectorAll('[data-mask-type]').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterTable(e.target.dataset.maskType));
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    filterTable(maskType) {
        // Update active button
        document.querySelectorAll('[data-mask-type]').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-mask-type="${maskType}"]`).classList.add('active');
        
        this.currentFilter = maskType;
        this.populateCidrTable();
    }

    isValidIP(ip) {
        const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
        const match = ip.match(regex);
        if (!match) return false;
        
        return match.slice(1).every(octet => {
            const num = parseInt(octet, 10);
            return num >= 0 && num <= 255;
        });
    }

    parseMask(mask) {
        if (mask.startsWith('/')) {
            const cidr = parseInt(mask.substring(1));
            if (cidr >= 8 && cidr <= 30) {
                return this.cidrToMask(cidr);
            }
        } else if (this.isValidIP(mask)) {
            return mask.split('.').map(Number);
        }
        return null;
    }

    cidrToMask(cidr) {
        const mask = [];
        let remaining = cidr;
        
        for (let i = 0; i < 4; i++) {
            if (remaining >= 8) {
                mask.push(255);
                remaining -= 8;
            } else if (remaining > 0) {
                mask.push(256 - Math.pow(2, 8 - remaining));
                remaining = 0;
            } else {
                mask.push(0);
            }
        }
        
        return mask;
    }

    getMaskType(mask) {
        // Determine if this is a 1, 2, or 3 octet mask
        if (mask[0] !== 255) return "1-octet";
        if (mask[1] !== 255) return "2-octet";
        if (mask[2] !== 255) return "3-octet";
        return "3-octet"; // /30 and similar
    }

    calculateSubnet(ipStr, maskStr) {
        if (!this.isValidIP(ipStr)) {
            throw new Error('Invalid IP address');
        }

        const maskArray = this.parseMask(maskStr);
        if (!maskArray) {
            throw new Error('Invalid subnet mask');
        }

        const ip = ipStr.split('.').map(Number);
        const mask = maskArray;
        const maskType = this.getMaskType(mask);

        // Find the interesting octet and calculate magic number
        let interestingOctet = -1;
        let magicNumber = 0;
        
        for (let i = 0; i < 4; i++) {
            if (mask[i] !== 0 && mask[i] !== 255) {
                interestingOctet = i;
                magicNumber = 256 - mask[i];
                break;
            }
        }

        // Calculate subnet ID
        const subnetId = [...ip];
        for (let i = 0; i < 4; i++) {
            if (mask[i] === 255) {
                // Copy IP address value
                subnetId[i] = ip[i];
            } else if (mask[i] === 0) {
                // Set to 0
                subnetId[i] = 0;
            } else {
                // Interesting octet - use magic number
                subnetId[i] = Math.floor(ip[i] / magicNumber) * magicNumber;
            }
        }

        // Calculate broadcast address
        const broadcast = [...subnetId];
        for (let i = 0; i < 4; i++) {
            if (mask[i] === 0) {
                broadcast[i] = 255;
            } else if (mask[i] !== 255 && mask[i] !== 0) {
                broadcast[i] = subnetId[i] + magicNumber - 1;
            }
        }

        // Calculate wildcard mask
        const wildcard = mask.map(octet => 255 - octet);

        // Calculate first and last usable hosts
        const firstHost = [...subnetId];
        const lastHost = [...broadcast];
        
        // Increment first host and decrement last host
        this.incrementIP(firstHost);
        this.decrementIP(lastHost);

        // Calculate total and usable hosts
        const hostBits = 32 - this.maskToCidr(mask);
        const totalHosts = Math.pow(2, hostBits);
        const usableHosts = totalHosts - 2;

        return {
            subnetId: subnetId.join('.'),
            broadcast: broadcast.join('.'),
            firstHost: firstHost.join('.'),
            lastHost: lastHost.join('.'),
            wildcard: wildcard.join('.'),
            totalHosts: totalHosts,
            usableHosts: usableHosts,
            magicNumber: magicNumber || 'N/A',
            interestingOctet: interestingOctet,
            maskType: maskType,
            steps: this.generateSteps(ip, mask, magicNumber, interestingOctet, maskType)
        };
    }

    incrementIP(ip) {
        for (let i = 3; i >= 0; i--) {
            if (ip[i] < 255) {
                ip[i]++;
                break;
            } else {
                ip[i] = 0;
            }
        }
    }

    decrementIP(ip) {
        for (let i = 3; i >= 0; i--) {
            if (ip[i] > 0) {
                ip[i]--;
                break;
            } else {
                ip[i] = 255;
            }
        }
    }

    maskToCidr(mask) {
        let cidr = 0;
        for (let octet of mask) {
            cidr += this.countBits(octet);
        }
        return cidr;
    }

    countBits(num) {
        let count = 0;
        while (num) {
            count += num & 1;
            num >>= 1;
        }
        return count;
    }

    generateSteps(ip, mask, magicNumber, interestingOctet, maskType) {
        const steps = [];
        
        steps.push({
            title: "Step 1: Identify the Subnet Mask Type",
            content: `This is a ${maskType} subnet mask. ${this.getMaskTypeDescription(maskType)}`
        });

        steps.push({
            title: "Step 2: Identify the Interesting Octet",
            content: interestingOctet >= 0 ? 
                `The interesting octet is position ${interestingOctet + 1} (${this.getOctetName(interestingOctet)}) with value ${mask[interestingOctet]} (neither 0 nor 255).` :
                `No interesting octet found - this is a standard class boundary (${maskType}).`
        });

        if (magicNumber > 0) {
            steps.push({
                title: "Step 3: Calculate Magic Number",
                content: `Magic Number = 256 - ${mask[interestingOctet]} = ${magicNumber}`
            });

            const rangeStart = Math.floor(ip[interestingOctet] / magicNumber) * magicNumber;
            const rangeEnd = rangeStart + magicNumber - 1;
            
            steps.push({
                title: "Step 4: Find Subnet Range",
                content: `IP address ${this.getOctetName(interestingOctet)} value: ${ip[interestingOctet]}\nMagic number multiples: 0, ${magicNumber}, ${magicNumber * 2}, ${magicNumber * 3}...\n${ip[interestingOctet]} falls in range ${rangeStart} to ${rangeEnd}`
            });
        }

        steps.push({
            title: "Step 5: Apply Magic Number Rules",
            content: `• If mask = 255: Copy IP address value\n• If mask = 0: Use 0 for subnet ID, 255 for broadcast\n• For interesting octet: Use magic number calculation\n\nFor ${maskType} masks, the interesting octet affects the ${this.getOctetName(interestingOctet)} position.`
        });

        return steps;
    }

    getMaskTypeDescription(maskType) {
        switch(maskType) {
            case "1-octet":
                return "The second octet is the interesting octet. Subnetting occurs in the second octet of the IP address.";
            case "2-octet":
                return "The third octet is the interesting octet. Subnetting occurs in the third octet of the IP address.";
            case "3-octet":
                return "The fourth octet is the interesting octet. Subnetting occurs in the fourth octet of the IP address.";
            default:
                return "Standard class boundary mask.";
        }
    }

    getOctetName(position) {
        const names = ["first", "second", "third", "fourth"];
        return names[position] || "unknown";
    }

    toBinary(num) {
        return num.toString(2).padStart(8, '0');
    }

    displayResults(result, ipStr, maskStr) {
        document.getElementById('subnet-id').textContent = result.subnetId;
        document.getElementById('broadcast-addr').textContent = result.broadcast;
        document.getElementById('first-host').textContent = result.firstHost;
        document.getElementById('last-host').textContent = result.lastHost;
        document.getElementById('wildcard-mask').textContent = result.wildcard;
        document.getElementById('total-ips').textContent = result.totalHosts.toLocaleString();
        document.getElementById('usable-hosts').textContent = result.usableHosts.toLocaleString();
        document.getElementById('magic-number').textContent = result.magicNumber;
        document.getElementById('interesting-octet-display').textContent = 
            result.interestingOctet >= 0 ? `Position ${result.interestingOctet + 1} (${this.getOctetName(result.interestingOctet)})` : 'None';
        document.getElementById('mask-type').textContent = result.maskType;

        // Display method steps
        const stepsContainer = document.getElementById('method-steps');
        stepsContainer.innerHTML = result.steps.map(step => `
            <div class="step-item">
                <div class="step-title">${step.title}</div>
                <div class="step-content">${step.content.replace(/\n/g, '<br>')}</div>
            </div>
        `).join('');

        // Display binary representation
        const ip = ipStr.split('.').map(Number);
        const mask = this.parseMask(maskStr);
        const subnetIdArray = result.subnetId.split('.').map(Number);
        const broadcastArray = result.broadcast.split('.').map(Number);

        const binaryContainer = document.getElementById('binary-display');
        binaryContainer.innerHTML = `
            <div class="binary-row">
                <span class="binary-label">IP Address:</span>
                <span class="binary-value">${ip.map(this.toBinary).join('.')}</span>
            </div>
            <div class="binary-row">
                <span class="binary-label">Subnet Mask:</span>
                <span class="binary-value">${mask.map(this.toBinary).join('.')}</span>
            </div>
            <div class="binary-row">
                <span class="binary-label">Subnet ID:</span>
                <span class="binary-value">${subnetIdArray.map(this.toBinary).join('.')}</span>
            </div>
            <div class="binary-row">
                <span class="binary-label">Broadcast:</span>
                <span class="binary-value">${broadcastArray.map(this.toBinary).join('.')}</span>
            </div>
        `;

        document.getElementById('results-container').style.display = 'block';
    }

    calculate() {
        const ipStr = document.getElementById('ip-address').value.trim();
        const maskStr = document.getElementById('subnet-mask').value.trim();

        if (!ipStr || !maskStr) {
            document.getElementById('results-container').style.display = 'none';
            return;
        }

        try {
            const result = this.calculateSubnet(ipStr, maskStr);
            this.displayResults(result, ipStr, maskStr);
        } catch (error) {
            document.getElementById('results-container').style.display = 'none';
            console.error('Calculation error:', error.message);
        }
    }

    showDefaultCalculation() {
        // Calculate with default values
        setTimeout(() => this.calculate(), 100);
    }

    generateRandomIP() {
        return Array.from({length: 4}, () => Math.floor(Math.random() * 256)).join('.');
    }

    generateNewProblem() {
        const difficulty = document.getElementById('difficulty-select').value;
        const range = this.difficultyRanges[difficulty];
        
        const cidr = Math.floor(Math.random() * (range.cidr_max - range.cidr_min + 1)) + range.cidr_min;
        const ip = this.generateRandomIP();
        const mask = this.cidrToMask(cidr).join('.');
        const maskType = this.getMaskType(this.cidrToMask(cidr));

        this.currentProblem = {
            ip: ip,
            mask: mask,
            maskType: maskType,
            result: this.calculateSubnet(ip, mask)
        };

        document.getElementById('practice-ip').textContent = ip;
        document.getElementById('practice-mask').textContent = `${mask} (/${cidr})`;
        document.getElementById('practice-mask-type').textContent = maskType;
        
        // Clear previous answers
        const inputs = ['answer-subnet-id', 'answer-broadcast', 'answer-first-host', 'answer-last-host', 'answer-wildcard', 'answer-hosts'];
        inputs.forEach(id => document.getElementById(id).value = '');

        document.getElementById('practice-problem').style.display = 'block';
        document.getElementById('feedback-section').style.display = 'none';
    }

    checkAnswers() {
        if (!this.currentProblem) return;

        const userAnswers = {
            subnetId: document.getElementById('answer-subnet-id').value.trim(),
            broadcast: document.getElementById('answer-broadcast').value.trim(),
            firstHost: document.getElementById('answer-first-host').value.trim(),
            lastHost: document.getElementById('answer-last-host').value.trim(),
            wildcard: document.getElementById('answer-wildcard').value.trim(),
            hosts: document.getElementById('answer-hosts').value.trim()
        };

        const correct = this.currentProblem.result;
        let correctCount = 0;
        const totalQuestions = 6;

        const feedback = [];
        
        // Check each answer
        const checks = [
            {key: 'subnetId', label: 'Subnet ID', correct: correct.subnetId},
            {key: 'broadcast', label: 'Broadcast Address', correct: correct.broadcast},
            {key: 'firstHost', label: 'First Usable Host', correct: correct.firstHost},
            {key: 'lastHost', label: 'Last Usable Host', correct: correct.lastHost},
            {key: 'wildcard', label: 'Wildcard Mask', correct: correct.wildcard},
            {key: 'hosts', label: 'Usable Hosts', correct: correct.usableHosts.toString()}
        ];

        checks.forEach(check => {
            const isCorrect = userAnswers[check.key] === check.correct;
            if (isCorrect) correctCount++;

            feedback.push({
                label: check.label,
                correct: isCorrect,
                userAnswer: userAnswers[check.key] || '(empty)',
                correctAnswer: check.correct
            });
        });

        this.totalAttempts++;
        if (correctCount === totalQuestions) {
            this.score++;
        }

        this.displayFeedback(feedback, correctCount, totalQuestions);
        this.updateScore();
    }

    displayFeedback(feedback, correctCount, totalQuestions) {
        const feedbackContainer = document.getElementById('feedback-content');
        const correctAnswersContainer = document.getElementById('correct-answers');

        const feedbackHtml = feedback.map(item => `
            <div class="feedback-item ${item.correct ? 'feedback-correct' : 'feedback-incorrect'}">
                <span class="feedback-label">${item.label}:</span>
                <div>
                    ${!item.correct ? `<div>Your answer: <span class="feedback-user-answer">${item.userAnswer}</span></div>` : ''}
                    <div>Correct answer: <span class="feedback-correct-answer">${item.correctAnswer}</span></div>
                </div>
            </div>
        `).join('');

        feedbackContainer.innerHTML = `
            <div class="text-center" style="margin-bottom: var(--space-16);">
                <h4 class="${correctCount === totalQuestions ? 'text-success' : 'text-error'}">
                    Score: ${correctCount}/${totalQuestions} ${correctCount === totalQuestions ? '🎉' : ''}
                </h4>
                <p>Mask Type: <span class="badge badge-${this.currentProblem.maskType}">${this.currentProblem.maskType}</span></p>
            </div>
            ${feedbackHtml}
        `;

        // Show step-by-step solution
        correctAnswersContainer.innerHTML = `
            <h4>Step-by-Step Solution:</h4>
            ${this.currentProblem.result.steps.map(step => `
                <div class="step-item">
                    <div class="step-title">${step.title}</div>
                    <div class="step-content">${step.content.replace(/\n/g, '<br>')}</div>
                </div>
            `).join('')}
        `;

        document.getElementById('feedback-section').style.display = 'block';
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('total-attempts').textContent = this.totalAttempts;
    }

    populateCidrTable() {
        const tbody = document.getElementById('cidr-table-body');
        const filteredChart = this.currentFilter === 'all' ? 
            this.cidrChart : 
            this.cidrChart.filter(row => row.type === this.currentFilter);

        tbody.innerHTML = filteredChart.map(row => `
            <tr class="mask-${row.type}">
                <td>${row.cidr}</td>
                <td>${row.mask}</td>
                <td>${row.wildcard}</td>
                <td>${parseInt(row.hosts).toLocaleString()}</td>
                <td>${row.magic_number}</td>
                <td><span class="badge badge-${row.type}">${row.type}</span></td>
            </tr>
        `).join('');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new SubnetCalculator();
});