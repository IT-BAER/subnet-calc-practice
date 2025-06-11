class SubnetCalculator {
    constructor() {
        this.cidrChart = [
            {"cidr": "/8", "mask": "255.0.0.0", "wildcard": "0.255.255.255", "hosts": "16777214"},
            {"cidr": "/9", "mask": "255.128.0.0", "wildcard": "0.127.255.255", "hosts": "8388606"},
            {"cidr": "/10", "mask": "255.192.0.0", "wildcard": "0.63.255.255", "hosts": "4194302"},
            {"cidr": "/11", "mask": "255.224.0.0", "wildcard": "0.31.255.255", "hosts": "2097150"},
            {"cidr": "/12", "mask": "255.240.0.0", "wildcard": "0.15.255.255", "hosts": "1048574"},
            {"cidr": "/13", "mask": "255.248.0.0", "wildcard": "0.7.255.255", "hosts": "524286"},
            {"cidr": "/14", "mask": "255.252.0.0", "wildcard": "0.3.255.255", "hosts": "262142"},
            {"cidr": "/15", "mask": "255.254.0.0", "wildcard": "0.1.255.255", "hosts": "131070"},
            {"cidr": "/16", "mask": "255.255.0.0", "wildcard": "0.0.255.255", "hosts": "65534"},
            {"cidr": "/17", "mask": "255.255.128.0", "wildcard": "0.0.127.255", "hosts": "32766"},
            {"cidr": "/18", "mask": "255.255.192.0", "wildcard": "0.0.63.255", "hosts": "16382"},
            {"cidr": "/19", "mask": "255.255.224.0", "wildcard": "0.0.31.255", "hosts": "8190"},
            {"cidr": "/20", "mask": "255.255.240.0", "wildcard": "0.0.15.255", "hosts": "4094"},
            {"cidr": "/21", "mask": "255.255.248.0", "wildcard": "0.0.7.255", "hosts": "2046"},
            {"cidr": "/22", "mask": "255.255.252.0", "wildcard": "0.0.3.255", "hosts": "1022"},
            {"cidr": "/23", "mask": "255.255.254.0", "wildcard": "0.0.1.255", "hosts": "510"},
            {"cidr": "/24", "mask": "255.255.255.0", "wildcard": "0.0.0.255", "hosts": "254"},
            {"cidr": "/25", "mask": "255.255.255.128", "wildcard": "0.0.0.127", "hosts": "126"},
            {"cidr": "/26", "mask": "255.255.255.192", "wildcard": "0.0.0.63", "hosts": "62"},
            {"cidr": "/27", "mask": "255.255.255.224", "wildcard": "0.0.0.31", "hosts": "30"},
            {"cidr": "/28", "mask": "255.255.255.240", "wildcard": "0.0.0.15", "hosts": "14"},
            {"cidr": "/29", "mask": "255.255.255.248", "wildcard": "0.0.0.7", "hosts": "6"},
            {"cidr": "/30", "mask": "255.255.255.252", "wildcard": "0.0.0.3", "hosts": "2"}
        ];
        this.difficultyRanges = {
            "class-a": {"cidr_min": 8, "cidr_max": 15},
            "class-b": {"cidr_min": 16, "cidr_max": 23},
            "class-c": {"cidr_min": 24, "cidr_max": 30},
            "all": {"cidr_min": 8, "cidr_max": 30}
        };
        this.score = 0;
        this.totalAttempts = 0;
        this.currentProblem = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateCidrTable();
        this.showDefaultCalculation();
    }

    setupEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        document.getElementById('ip-address').addEventListener('input', () => this.calculate());
        document.getElementById('subnet-mask').addEventListener('input', () => this.calculate());
        document.getElementById('new-problem-btn').addEventListener('click', () => this.generateNewProblem());
        document.getElementById('check-answers-btn').addEventListener('click', () => this.checkAnswers());
        document.getElementById('difficulty-select').addEventListener('change', () => this.generateNewProblem());
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    isValidIP(ip) {
        const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
        const match = ip.match(regex);
        if (!match) return false;
        return match.slice(1).every(octet => parseInt(octet, 10) >= 0 && parseInt(octet, 10) <= 255);
    }

    parseMask(mask) {
        if (mask.startsWith('/')) {
            const cidr = parseInt(mask.substring(1));
            if (cidr >= 8 && cidr <= 30) return this.cidrToMask(cidr);
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

    calculateSubnet(ipStr, maskStr) {
        if (!this.isValidIP(ipStr)) throw new Error('Invalid IP address');
        const mask = this.parseMask(maskStr);
        if (!mask) throw new Error('Invalid subnet mask');

        const ip = ipStr.split('.').map(Number);
        let calculationOctet = -1;
        let magicNumber = 0;
        for (let i = 0; i < 4; i++) {
            if (mask[i] !== 0 && mask[i] !== 255) {
                calculationOctet = i;
                magicNumber = 256 - mask[i];
                break;
            }
        }
        
        const subnetId = ip.map((ipOctet, i) => {
            if (mask[i] === 255) return ipOctet;
            if (mask[i] === 0) return 0;
            return Math.floor(ipOctet / magicNumber) * magicNumber;
        });
        
        const broadcast = subnetId.map((subnetOctet, i) => {
            if (mask[i] === 0) return 255;
            if (mask[i] !== 255) return subnetOctet + magicNumber - 1;
            return subnetOctet;
        });

        const wildcard = mask.map(octet => 255 - octet);
        const firstHost = [...subnetId];
        this.incrementIP(firstHost);
        const lastHost = [...broadcast];
        this.decrementIP(lastHost);

        const cidr = this.maskToCidr(mask);
        const hostBits = 32 - cidr;
        const totalHosts = Math.pow(2, hostBits);
        const usableHosts = totalHosts >= 2 ? totalHosts - 2 : 0;
        const fullMaskDisplay = `${mask.join('.')} (/${cidr})`;

        return {
            subnetId: subnetId.join('.'),
            broadcast: broadcast.join('.'),
            firstHost: firstHost.join('.'),
            lastHost: lastHost.join('.'),
            wildcard: wildcard.join('.'),
            totalHosts,
            usableHosts,
            magicNumber: magicNumber || 'N/A',
            steps: this.generateSteps(ip, mask, magicNumber, calculationOctet),
            fullMaskDisplay: fullMaskDisplay
        };
    }

    incrementIP(ip) {
        for (let i = 3; i >= 0; i--) {
            if (ip[i] < 255) { ip[i]++; break; } 
            else { ip[i] = 0; }
        }
    }

    decrementIP(ip) {
        for (let i = 3; i >= 0; i--) {
            if (ip[i] > 0) { ip[i]--; break; } 
            else { ip[i] = 255; }
        }
    }

    maskToCidr(mask) {
        return mask.reduce((cidr, octet) => cidr + (octet.toString(2).match(/1/g) || []).length, 0);
    }
    
    generateSteps(ip, mask, magicNumber, calculationOctet) {
        const steps = [];
        const octetName = pos => ["first", "second", "third", "fourth"][pos] || "unknown";

        steps.push({
            title: "Step 1: Identify the Calculation Octet",
            content: calculationOctet >= 0 ? `The calculation focuses on the ${octetName(calculationOctet)} octet (position ${calculationOctet + 1}), where the mask value is ${mask[calculationOctet]}. This is the first octet that isn't 255 or 0.` : `This is a standard class boundary. No special calculation is needed.`
        });

        if (magicNumber > 0) {
            steps.push({
                title: "Step 2: Calculate the Magic Number",
                content: `The Magic Number is 256 - ${mask[calculationOctet]} = <strong>${magicNumber}</strong>.`
            });
            const rangeStart = Math.floor(ip[calculationOctet] / magicNumber) * magicNumber;
            steps.push({
                title: "Step 3: Find the Subnet Range",
                content: `The value in the IP address's calculation octet is ${ip[calculationOctet]}. By finding the multiple of the Magic Number (${magicNumber}) that is closest to but not greater than this value, we find the start of our subnet range. The network ID for this octet is <strong>${rangeStart}</strong>.`
            });
        }
        steps.push({
            title: "Step 4: Determine Network and Broadcast Addresses",
            content: `For each octet:<br>• If mask is 255, copy the IP's value for the network address.<br>• If mask is 0, use 0 for the network address and 255 for the broadcast.<br>• For the calculation octet, use the range start (${magicNumber > 0 ? 'e.g., ' + Math.floor(ip[calculationOctet] / magicNumber) * magicNumber : 'N/A'}) for the network ID and the range end for the broadcast.`
        });
        return steps;
    }

    toBinary(num) {
        return num.toString(2).padStart(8, '0');
    }

    displayResults(result, ipStr, maskStr) {
        document.getElementById('subnet-id').textContent = result.subnetId;
        document.getElementById('broadcast-addr').textContent = result.broadcast;
        document.getElementById('first-host').textContent = result.firstHost;
        document.getElementById('last-host').textContent = result.lastHost;
        document.getElementById('subnet-mask-display').textContent = result.fullMaskDisplay;
        document.getElementById('wildcard-mask').textContent = result.wildcard;
        document.getElementById('total-ips').textContent = result.totalHosts.toLocaleString();
        document.getElementById('usable-hosts').textContent = result.usableHosts.toLocaleString();
        document.getElementById('magic-number').textContent = result.magicNumber;

        const stepsContainer = document.getElementById('method-steps');
        stepsContainer.innerHTML = result.steps.map(step => `<div class="step-item"><div class="step-title">${step.title}</div><div class="step-content">${step.content}</div></div>`).join('');
        
        const binaryContainer = document.getElementById('binary-display');
        const ipBin = ipStr.split('.').map(o => this.toBinary(parseInt(o))).join('.');
        const maskBin = this.parseMask(maskStr).map(o => this.toBinary(o)).join('.');
        const wildcardBin = result.wildcard.split('.').map(o => this.toBinary(parseInt(o))).join('.');
        binaryContainer.innerHTML = `
            <div class="binary-row"><span class="binary-label">IP Address:</span><span class="binary-value">${ipBin}</span></div>
            <div class="binary-row"><span class="binary-label">Subnet Mask:</span><span class="binary-value">${maskBin}</span></div>
            <div class="binary-row"><span class="binary-label">Wildcard Mask:</span><span class="binary-value">${wildcardBin}</span></div>
        `;
    }

    calculate() {
        const ipStr = document.getElementById('ip-address').value;
        const maskStr = document.getElementById('subnet-mask').value;
        const resultsContainer = document.getElementById('results-container');
        const errorMsg = document.getElementById('error-message');

        try {
            if (!ipStr || !maskStr) {
                resultsContainer.classList.add('hidden');
                errorMsg.classList.add('hidden');
                return;
            }
            const result = this.calculateSubnet(ipStr, maskStr);
            this.displayResults(result, ipStr, maskStr);
            resultsContainer.classList.remove('hidden');
            errorMsg.classList.add('hidden');
        } catch (e) {
            resultsContainer.classList.add('hidden');
            errorMsg.textContent = e.message;
            errorMsg.classList.remove('hidden');
        }
    }
    
    showDefaultCalculation() {
        document.getElementById('ip-address').value = '192.168.10.55';
        document.getElementById('subnet-mask').value = '/27';
        this.calculate();
    }

    populateCidrTable() {
        const tableBody = document.getElementById('cidr-table-body');
        tableBody.innerHTML = '';
        this.cidrChart.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.cidr}</td>
                <td>${entry.mask}</td>
                <td>${entry.wildcard}</td>
                <td>${parseInt(entry.hosts).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    generateNewProblem() {
        const difficulty = document.getElementById('difficulty-select').value;
        const range = this.difficultyRanges[difficulty];
        const cidr = Math.floor(Math.random() * (range.cidr_max - range.cidr_min + 1)) + range.cidr_min;
        const ip = [
            Math.floor(Math.random() * 223) + 1,
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        ].join('.');

        const maskStr = `/${cidr}`;
        this.currentProblem = {
            ip,
            mask: maskStr,
            solution: this.calculateSubnet(ip, maskStr)
        };
        document.getElementById('practice-ip').textContent = ip;
        document.getElementById('practice-mask').textContent = this.currentProblem.solution.fullMaskDisplay;
        document.getElementById('practice-problem').classList.remove('hidden');
        document.getElementById('feedback-section').innerHTML = '';
        document.getElementById('practice-inputs').querySelectorAll('input').forEach(input => input.value = '');
    }

    checkAnswers() {
        if (!this.currentProblem) return;
        const solution = this.currentProblem.solution;
        const feedbackContainer = document.getElementById('feedback-section');
        feedbackContainer.innerHTML = '';
        let correctCount = 0;

        const fields = [
            { id: 'practice-subnet-id', key: 'subnetId', label: 'Subnet ID' },
            { id: 'practice-broadcast', key: 'broadcast', label: 'Broadcast Address' },
            { id: 'practice-first-host', key: 'firstHost', label: 'First Usable Host' },
            { id: 'practice-last-host', key: 'lastHost', label: 'Last Usable Host' }
        ];

        fields.forEach(field => {
            const userInput = document.getElementById(field.id).value.trim();
            const correctAnswer = solution[field.key];
            const isCorrect = userInput === correctAnswer;

            const feedbackItem = document.createElement('div');
            feedbackItem.classList.add('feedback-item');
            if (isCorrect) {
                feedbackItem.classList.add('feedback-correct');
                feedbackItem.innerHTML = `<span class="feedback-label">${field.label}:</span> <span class="feedback-correct-answer">${userInput} ✔</span>`;
                correctCount++;
            } else {
                feedbackItem.classList.add('feedback-incorrect');
                feedbackItem.innerHTML = `<span class="feedback-label">${field.label}:</span> <div><span class="feedback-user-answer">${userInput || 'No answer'} ✖</span> <span class="feedback-correct-answer">Correct: ${correctAnswer}</span></div>`;
            }
            feedbackContainer.appendChild(feedbackItem);
        });
        
        const additionalInfo = `
            <div class="feedback-item feedback-info">
                <span class="feedback-label">Wildcard Mask:</span>
                <span class="feedback-correct-answer">${solution.wildcard}</span>
            </div>
            <div class="feedback-item feedback-info">
                <span class="feedback-label">Number of Usable Hosts:</span>
                <span class="feedback-correct-answer">${solution.usableHosts.toLocaleString()}</span>
            </div>
        `;
        feedbackContainer.innerHTML += additionalInfo;

        this.updateScore(correctCount, fields.length);
    }

    updateScore(correctAnswers, totalQuestions) {
        if (correctAnswers === totalQuestions) {
            this.score++;
        }
        this.totalAttempts++;
        document.getElementById('score').textContent = this.score;
        document.getElementById('total-attempts').textContent = this.totalAttempts;
    }
}

document.addEventListener('DOMContentLoaded', () => new SubnetCalculator());
