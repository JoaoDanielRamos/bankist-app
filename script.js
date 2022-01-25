'use strict';

// ? ## DATA ##

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [
    {
      type: 'deposit',
      amount: 100,
      date: new Date(),
      currency: 'EUR',
    },
    {
      type: 'deposit',
      amount: 450,
      date: new Date().setDate(new Date().getDate() - 1),
      currency: 'EUR',
    },
    {
      type: 'withdraw',
      amount: -400,
      date: new Date().setDate(new Date().getDate() - 1),
      currency: 'EUR',
    },
    {
      type: 'deposit',
      amount: 3000,
      date: new Date().setDate(new Date().getDate() - 3),
      currency: 'EUR',
    },
    {
      type: 'withdraw',
      amount: -650,
      date: '2020-02-05T16:33:06.386Z',
      currency: 'EUR',
    },
    {
      type: 'withdraw',
      amount: -130,
      date: '2020-04-10T14:43:26.374Z',
      currency: 'EUR',
    },
    {
      type: 'deposit',
      amount: 70,
      date: '2020-06-25T18:49:59.371Z',
      currency: 'EUR',
    },
    {
      type: 'deposit',
      amount: 1300,
      date: '2020-07-26T12:01:20.894Z',
      currency: 'EUR',
    },
  ],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [
    {
      type: 'deposit',
      amount: 5000,
      date: new Date(),
      currency: 'EUR',
    },
    {
      type: 'deposit',
      amount: 3400,
      date: new Date().setDate(new Date().getDate() - 1),
      currency: 'EUR',
    },
    {
      type: 'withdraw',
      amount: -150,
      date: new Date().setDate(new Date().getDate() - 2),
      currency: 'EUR',
    },
    {
      type: 'withdraw',
      amount: -790,
      date: new Date().setDate(new Date().getDate() - 4),
      currency: 'EUR',
    },
    {
      type: 'withdraw',
      amount: -3210,
      date: '2020-05-08T14:11:59.604Z',
      currency: 'EUR',
    },
    {
      type: 'withdraw',
      amount: -1000,
      date: '2020-07-26T17:01:17.194Z',
      currency: 'EUR',
    },
    {
      type: 'deposit',
      amount: 8500,
      date: '2020-07-28T23:36:17.929Z',
      currency: 'EUR',
    },
    {
      type: 'withdraw',
      amount: -30,
      date: '2020-08-01T10:51:36.790Z',
      currency: 'EUR',
    },
  ],
  interestRate: 1.5,
  pin: 2222,
};

// ? ## VARIABLES ##

// ! CONTAINERS
const containerApp = document.querySelector('.app'),
  containerMovements = document.querySelector('.movements'),
  containerLoginField = document.querySelector('.login'),
  containerAccounts = document.querySelector('.accounts');

// ! LABELS
const labelWelcome = document.querySelector('.welcome'),
  labelDate = document.querySelector('.date'),
  labelBalance = document.querySelector('.balance__value'),
  labelSumIn = document.querySelector('.summary__value--in'),
  labelSumOut = document.querySelector('.summary__value--out'),
  labelSumInterest = document.querySelector('.summary__value--interest'),
  labelTimer = document.querySelector('.timer'),
  labelError = document.querySelector('.error');

// ! FORMS
const formTransfer = document.querySelector('.form--transfer'),
  formClose = document.querySelector('.form--close'),
  formLoan = document.querySelector('.form--loan');

// ! INPUTS
const inputLoginUsername = document.querySelector('.login__input--user'),
  inputLoginPin = document.querySelector('.login__input--pin'),
  inputTransferTo = document.querySelector('.form__input--to'),
  inputTransferAmount = document.querySelector('.form__input--amount'),
  inputLoanAmount = document.querySelector('.form__input--loan-amount'),
  inputCloseUsername = document.querySelector('.form__input--user'),
  inputClosePin = document.querySelector('.form__input--pin');

// ! BUTTONS
const btnLogin = document.querySelector('.login__btn'),
  btnLogout = document.querySelector('.logout'),
  btnTransfer = document.querySelector('.form__btn--transfer'),
  btnLoan = document.querySelector('.form__btn--loan'),
  btnClose = document.querySelector('.form__btn--close'),
  btnSort = document.querySelector('.btn--sort');

// ! APP
const accounts = [account1, account2];
let activeAccount = undefined;
let theTimer = undefined;

// ? ## FUNCTIONS ## */

// ! LOG IN
const logIn = () => {
  containerAccounts.classList.add('hidden');

  setTimeout(() => {
    containerApp.style.opacity = 1;

    labelWelcome.innerHTML = `Welcome, ${activeAccount.owner.split(' ')[0]}!`;

    inputLoginUsername.classList.add('hidden-for-good');
    inputLoginPin.classList.add('hidden-for-good');
    btnLogin.classList.add('hidden-for-good');
    btnLogout.classList.remove('hidden-for-good');
    labelError.classList.add('hidden-for-good');
    containerAccounts.classList.add('hidden');
    logOutTimer(240);

    updateDOM(activeAccount);
  }, 650);
};

// ! LOG OUT
const logOut = () => {
  containerApp.style.opacity = 0;
  labelWelcome.innerHTML = `Log in to get started`;
  inputLoginUsername.classList.remove('hidden-for-good');
  inputLoginPin.classList.remove('hidden-for-good');
  btnLogin.classList.remove('hidden-for-good');
  btnLogout.classList.add('hidden-for-good');
  labelError.classList.remove('hidden-for-good');
  fieldReset();
  clearInterval(theTimer);

  setTimeout(() => {
    containerAccounts.classList.remove('hidden');
  }, 650);
};

// ! FIELD RESET
const fieldReset = () => {
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputClosePin.value = '';
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  inputCloseUsername.value = '';
  inputLoginUsername.placeholder = 'user';
  inputLoanAmount.value = '';
  inputLoginPin.placeholder = 'PIN';
  labelTimer.innerHTML = `04:00`;
};

// ! FORMAT DATE
const formatDate = (movementDate, type) => {
  const date = new Date(movementDate);
  let locale = navigator.language;
  let options;

  if (type === 'transaction') {
    options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    if (date.getDate() === new Date().getDate()) {
      return `today`;
    } else if (date.getDate() === new Date().getDate() - 1) {
      return `yesterday`;
    } else {
      return new Intl.DateTimeFormat('en-CA', options).format(date);
    }
  } else if (type === 'heading') {
    options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    return new Intl.DateTimeFormat(locale, options).format(date);
  }
};

// ! FORMAT CURRENCY GLOBAL
const formatCurrencyGlobal = (number, currency) => {
  return new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: currency,
  }).format(number);
};

// ! FORMAT CURRENCY FOR MOVEMENTS
const formatCurrency = movement => {
  let locale = navigator.language;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: movement.currency,
  }).format(movement.amount);
};

// ! ADD TRANSACTION ROW TO TRANSACTION CONTAINER
const addTransactionRow = (movement, index) => {
  return ` <div class="movements__row">
  <div class="movements__type movements__type--${movement.type}">${
    activeAccount.movements.length - index
  } ${movement.type}</div>
  <div class="movements__date">
	${formatDate(movement.date, 'transaction')}</div>
  <div class="movements__value">
  ${formatCurrency(movement)}
  </div>
</div>`;
};

// ! UPDATE DOM
const updateDOM = (account = undefined) => {
  // IF ACCOUNT EXISTS
  if (account) {
    fieldReset();
    generateBalance(accounts);
    generateWithdraws(accounts);
    generateDeposits(accounts);

    // DISPLAY DATE
    let now = new Date();
    labelDate.textContent = formatDate(now, 'heading');

    // DISPLAYING BALANCE
    labelBalance.innerHTML = `${formatCurrencyGlobal(account.balance, 'EUR')}`;

    // DISPLAYING INTEREST
    generateInterest(accounts);
    labelSumInterest.innerHTML = `${formatCurrencyGlobal(
      account.interest,
      'EUR'
    )}`;

    // DISPLAYING MOVEMENTS
    containerMovements.innerHTML = '';
    account.movements.forEach(function (movement, index) {
      containerMovements.insertAdjacentHTML(
        'beforeend',
        addTransactionRow(movement, index)
      ); // try 'beforend'
    });

    // APPLYING DIFFERENT BACKGROUNDS TO DIFFERENT MOVEMENTS ROW
    let ArrayOfMovementsContainers = Array.from(
      document.querySelectorAll('.movements__row')
    );
    ArrayOfMovementsContainers.forEach((movementContainer, i) => {
      if (i % 2 !== 0) {
        movementContainer.style.backgroundColor = '#F6F6F6';
      }
    });

    // DISPLAYING INCOME AND OUTCOME
    labelSumIn.innerHTML = `${formatCurrencyGlobal(
      account.totalDeposits,
      'EUR'
    )}`;
    labelSumOut.innerHTML = `${formatCurrencyGlobal(
      account.totalWithdraws,
      'EUR'
    )}`;
  }
};

// ! SORT MOVEMENTS - Ascending
const sortMovementsAscending = account => {
  account.movements.sort((a, b) => a.amount - b.amount);

  containerMovements.innerHTML = '';

  account.movements.forEach(function (movement, index) {
    containerMovements.insertAdjacentHTML(
      'afterbegin',
      addTransactionRow(movement, index)
    ); // try 'beforend'
  });
};

// ! SORT MOVEMENTS - Descending
const sortMovementsDescending = account => {
  account.movements.sort((a, b) => b.amount - a.amount);

  containerMovements.innerHTML = '';

  account.movements.forEach(function (movement, index) {
    containerMovements.insertAdjacentHTML(
      'afterbegin',
      addTransactionRow(movement, index)
    ); // try 'beforend'
  });
};

// ! GENERATE USERNAME
const generateUserNames = accounts => {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name.length > 3 ? name[0] : 'delete';
      })
      .filter(word => word !== 'delete')
      .join('');
  });
};

// ! GENERATE USER DEPOSITS
const generateDeposits = accounts => {
  // LIST OF DEPOSITS
  accounts.forEach(function (account) {
    // LIST OF DEPOSITS
    account.deposits = [];
    let arrayOfDeposits = account.movements.filter(
      movement => movement.type === 'deposit' || movement.type === 'loan'
    );

    arrayOfDeposits.forEach(deposit => account.deposits.push(deposit.amount));

    // TOTAL DEPOSITS
    account.totalDeposits = account.deposits
      .reduce((acc, next) => acc + next, 0)
      .toFixed(2);
  });
};

// ! GENERATE USER WITHDRAWS
const generateWithdraws = accounts => {
  accounts.forEach(function (account) {
    // LIST OF WITHDRAWS
    account.withdraws = [];

    let arrayOfWithdraws = account.movements.filter(
      movement => movement.type === 'withdraw' || movement.type === 'transfer'
    );

    arrayOfWithdraws.forEach(deposit => account.withdraws.push(deposit.amount));

    // TOTAL WITHDRAWS
    account.totalWithdraws = account.withdraws
      .reduce((acc, next) => acc + next, 0)
      .toFixed(2);
  });
};

// ! GENERATE USER BALANCE
const generateBalance = accounts => {
  accounts.forEach(function (account) {
    account.balance = account.movements
      .reduce(function (total, movement) {
        return total + movement.amount;
      }, 0)
      .toFixed(2);
  });
};

// ! GENERATE INTEREST
const generateInterest = accounts => {
  accounts.forEach(
    account =>
      (account.interest = account.deposits
        .map(deposit => (deposit * 1.2) / 100)
        .filter(interest => interest >= 1)
        .reduce((acc, next) => acc + next, 0)
        .toFixed(2))
  );
};

// ! SHAKE
const makeItShake = container => {
  container.classList.add('shake');

  setTimeout(() => {
    container.classList.remove('shake');
  }, 500);
};

// ! TIMER
const logOutTimer = timeInSeconds => {
  // Set time to...
  let startsAt = timeInSeconds;

  let tick = () => {
    const min = String(Math.trunc(startsAt / 60)).padStart(2, 0);
    const seconds = String(startsAt % 60).padStart(2, 0);

    // In each call print the remaining to UI
    labelTimer.innerHTML = `${min}:${seconds}`;

    // When the timer reaches 0, log out
    if (startsAt === 0) {
      logOut();
      updateDOM(activeAccount);
      clearInterval(theTimer);
    }
    // Decrease 1 second
    startsAt--;
  };

  tick();
  theTimer = setInterval(tick, 1000);
  return theTimer;
};

// ? ## EVENT LISTENERS ##

// ! LOGIN IN
btnLogin.addEventListener('click', event => {
  event.preventDefault();

  // SETTING ACTIVE ACCOUNT
  activeAccount = accounts.find(
    account =>
      account.username === inputLoginUsername.value &&
      account.pin === +inputLoginPin.value
  );

  // IF ACCOUNT EXISTS
  if (activeAccount) {
    logIn();

    // IF IT DOES NOT
  } else {
    makeItShake(containerLoginField);
    labelError.classList.remove('hidden');
    fieldReset();

    setTimeout(() => {
      labelError.classList.add('hidden');
    }, 1200);
  }
});

// ! LOGOUT
btnLogout.addEventListener('click', event => {
  event.preventDefault();
  logOut();
  updateDOM(activeAccount);
});

// ! TRANSFER MONEY
btnTransfer.addEventListener('click', event => {
  event.preventDefault();

  setTimeout(() => {
    // Setting the user to receive the transfer
    let receiverAcc = accounts.find(
      acc => acc.username === inputTransferTo.value
    );
    // Amount of the transfer
    let amount = +inputTransferAmount.value;

    // Checking if inputs are empty
    if (inputTransferAmount.value === '' || inputTransferTo.value === '') {
      makeItShake(formTransfer);
    } else {
      if (activeAccount === receiverAcc) {
        makeItShake(formTransfer);
      } else {
        // Checking if user has enough balance
        if (activeAccount.balance >= amount) {
          activeAccount.movements.unshift({
            type: 'transfer',
            amount: -amount,
            date: new Date(),
            currency: 'USD',
          });
          receiverAcc.movements.unshift({
            type: 'deposit',
            amount: amount,
            date: new Date(),
            currency: 'USD',
          });
          updateDOM(activeAccount);
          clearInterval(theTimer);
          logOutTimer(240);
        } else {
          makeItShake(formTransfer);
        }
      }
    }
  }, 1000);
});

// ! REQUEST LOAN
btnLoan.addEventListener('click', event => {
  event.preventDefault();

  setTimeout(() => {
    const amount = Math.floor(+inputLoanAmount.value);

    if (
      amount > 0 &&
      activeAccount.movements.some(mov => mov.amount >= amount * 0.1)
    ) {
      activeAccount.movements.unshift({
        type: 'loan',
        amount: amount,
        date: new Date(),
        currency: 'USD',
      });
      updateDOM(activeAccount);
      clearInterval(theTimer);
      logOutTimer(240);
    } else {
      makeItShake(formLoan);
    }
  }, 1000);
});

// ! CLOSE ACCOUNT
btnClose.addEventListener('click', event => {
  event.preventDefault();

  if (
    +inputClosePin.value === activeAccount.pin &&
    inputCloseUsername.value === activeAccount.username
  ) {
    accounts.splice(accounts.indexOf(activeAccount), 1);
    logOut();
  } else {
    makeItShake(formClose);
    fieldReset();
  }
});

// ! SORT
btnSort.addEventListener('click', () => {
  if (btnSort.classList.contains('greater')) {
    sortMovementsDescending(activeAccount);
    btnSort.classList.add('lesser');
    btnSort.classList.remove('greater');
    btnSort.innerHTML = '&downarrow; SORT';
  } else {
    sortMovementsAscending(activeAccount);
    btnSort.classList.remove('lesser');
    btnSort.classList.add('greater');
    btnSort.innerHTML = '&uparrow; SORT';
  }
});

// ? ## APP START ##

generateUserNames(accounts);
