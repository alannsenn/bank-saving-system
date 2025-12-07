# Bank Saving System - Diagrams

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    Customer ||--o{ Account : "has"
    DepositoType ||--o{ Account : "defines"
    Account ||--o{ Transaction : "contains"

    Customer {
        int id PK
        string name
        datetime createdAt
    }

    DepositoType {
        int id PK
        string name UK
        float yearlyReturn
        datetime createdAt
    }

    Account {
        int id PK
        int customerId FK
        int depositoTypeId FK
        float balance
        datetime depositDate
        datetime createdAt
    }

    Transaction {
        int id PK
        int accountId FK
        string type
        float amount
        datetime date
        datetime createdAt
    }
```

## Class Diagram

```mermaid
classDiagram
    class Customer {
        +int id
        +string name
        +datetime createdAt
        +Account[] accounts
    }

    class DepositoType {
        +int id
        +string name
        +float yearlyReturn
        +datetime createdAt
        +Account[] accounts
    }

    class Account {
        +int id
        +int customerId
        +int depositoTypeId
        +float balance
        +datetime depositDate
        +datetime createdAt
        +Customer customer
        +DepositoType depositoType
        +Transaction[] transactions
    }

    class Transaction {
        +int id
        +int accountId
        +string type
        +float amount
        +datetime date
        +datetime createdAt
        +Account account
    }

    class CustomerController {
        +getAll() Customer[]
        +getById(id) Customer
        +create(data) Customer
        +update(id, data) Customer
        +delete(id) void
    }

    class DepositoTypeController {
        +getAll() DepositoType[]
        +getById(id) DepositoType
        +create(data) DepositoType
        +update(id, data) DepositoType
        +delete(id) void
    }

    class AccountController {
        +getAll() Account[]
        +getById(id) Account
        +create(data) Account
        +update(id, data) Account
        +delete(id) void
        +deposit(accountId, amount, date) Account
        +withdraw(accountId, amount, date) Account
        +calculateMonthsDifference(start, end) int
        +calculateEndingBalance(balance, rate, start, end) float
    }

    Customer "1" --> "*" Account : has
    DepositoType "1" --> "*" Account : defines
    Account "1" --> "*" Transaction : contains

    CustomerController ..> Customer : manages
    DepositoTypeController ..> DepositoType : manages
    AccountController ..> Account : manages
    AccountController ..> Transaction : creates
```

## System Architecture Diagram

```mermaid
graph TB
    subgraph Frontend["Frontend Layer (React/Next.js)"]
        Pages[Pages/Views]
        Components[UI Components]
    end

    subgraph API["API Layer (Next.js API Routes)"]
        CustomerAPI[Customer API]
        AccountAPI[Account API]
        DepositoAPI[Deposito Type API]
    end

    subgraph Controllers["Controller Layer (MVC)"]
        CustomerCtrl[Customer Controller]
        AccountCtrl[Account Controller]
        DepositoCtrl[Deposito Type Controller]
    end

    subgraph Models["Model Layer (Prisma ORM)"]
        CustomerModel[Customer Model]
        AccountModel[Account Model]
        DepositoModel[Deposito Type Model]
        TransactionModel[Transaction Model]
    end

    subgraph Database["Database (SQLite)"]
        DB[(dev.db)]
    end

    Pages --> CustomerAPI
    Pages --> AccountAPI
    Pages --> DepositoAPI

    CustomerAPI --> CustomerCtrl
    AccountAPI --> AccountCtrl
    DepositoAPI --> DepositoCtrl

    CustomerCtrl --> CustomerModel
    AccountCtrl --> AccountModel
    AccountCtrl --> TransactionModel
    DepositoCtrl --> DepositoModel

    CustomerModel --> DB
    AccountModel --> DB
    DepositoModel --> DB
    TransactionModel --> DB
```

## Sequence Diagram - Withdraw Process

```mermaid
sequenceDiagram
    participant User
    participant AccountPage
    participant API
    participant Controller
    participant Database

    User->>AccountPage: Enter withdraw amount & date
    AccountPage->>AccountPage: Calculate ending balance
    AccountPage->>User: Show ending balance preview
    User->>AccountPage: Confirm withdraw
    AccountPage->>API: POST /api/accounts/[id]/withdraw
    API->>Controller: withdraw(accountId, amount, date)
    Controller->>Database: Get account with deposito type
    Database-->>Controller: Account data
    Controller->>Controller: Calculate ending balance
    Controller->>Controller: Validate amount <= ending balance
    Controller->>Database: Create transaction record
    Controller->>Database: Update account balance
    Database-->>Controller: Updated account
    Controller-->>API: Return account data
    API-->>AccountPage: Success response
    AccountPage->>AccountPage: Refresh account data
    AccountPage-->>User: Show updated balance
```

## User Flow Diagram - Bank Saving System

```mermaid
flowchart TD
    Start([User Opens App]) --> Homepage[Homepage<br/>3 Menu Options]

    Homepage --> ChooseAction{Choose<br/>Module}

    ChooseAction -->|Customers| CustomerList[View Customer List]
    ChooseAction -->|Accounts| AccountList[View Account List]
    ChooseAction -->|Deposito Types| DepositoList[View Deposito Type List]

    %% Customer Module
    CustomerList --> CustomerAction{Choose<br/>Action}
    CustomerAction -->|Add New| CreateCustomer[New Customer Form<br/>Enter Name]
    CustomerAction -->|Click Edit| EditCustomer[Edit Customer Form<br/>Update Name]
    CustomerAction -->|Back| Homepage

    CreateCustomer --> SaveCustomer[Submit]
    SaveCustomer --> CustomerSaved{Success?}
    CustomerSaved -->|Yes| CustomerList
    CustomerSaved -->|No| CreateCustomer

    EditCustomer --> CustomerChoice{Action}
    CustomerChoice -->|Save| UpdateCustomer[Submit]
    CustomerChoice -->|Delete| ConfirmDeleteC{Confirm?}
    CustomerChoice -->|Cancel| CustomerList
    UpdateCustomer --> CustomerList
    ConfirmDeleteC -->|Yes| DeleteCustomer[Delete]
    ConfirmDeleteC -->|No| EditCustomer
    DeleteCustomer --> CustomerList

    %% Deposito Type Module
    DepositoList --> DepositoAction{Choose<br/>Action}
    DepositoAction -->|Add New| CreateDeposito[New Deposito Form<br/>Enter Name & Rate]
    DepositoAction -->|Click Edit| EditDeposito[Edit Deposito Form<br/>Update Details]
    DepositoAction -->|Back| Homepage

    CreateDeposito --> SaveDeposito[Submit]
    SaveDeposito --> DepositoSaved{Success?}
    DepositoSaved -->|Yes| DepositoList
    DepositoSaved -->|No| CreateDeposito

    EditDeposito --> DepositoChoice{Action}
    DepositoChoice -->|Save| UpdateDeposito[Submit]
    DepositoChoice -->|Delete| ConfirmDeleteD{Confirm?}
    DepositoChoice -->|Cancel| DepositoList
    UpdateDeposito --> DepositoList
    ConfirmDeleteD -->|Yes| DeleteDeposito[Delete]
    ConfirmDeleteD -->|No| EditDeposito
    DeleteDeposito --> DepositoList

    %% Account Module
    AccountList --> AccountAction{Choose<br/>Action}
    AccountAction -->|Add New| CreateAccount[New Account Form]
    AccountAction -->|Click View| ViewAccount[View Account Details<br/>Show Info & Transactions]
    AccountAction -->|Back| Homepage

    CreateAccount --> SelectCustomer[Select Customer]
    SelectCustomer --> SelectDepositoType[Select Deposito Type]
    SelectDepositoType --> EnterInitialBalance[Enter Initial Balance]
    EnterInitialBalance --> SaveAccount[Submit]
    SaveAccount --> AccountSaved{Success?}
    AccountSaved -->|Yes| AccountList
    AccountSaved -->|No| CreateAccount

    %% Account Details & Transactions
    ViewAccount --> AccountDetailsAction{Choose<br/>Action}

    AccountDetailsAction -->|Deposit| DepositFlow[Enter Amount & Date]
    AccountDetailsAction -->|Withdraw| WithdrawFlow[Enter Amount & Date]
    AccountDetailsAction -->|Delete Account| ConfirmDeleteA{Confirm?}
    AccountDetailsAction -->|Back| AccountList

    ConfirmDeleteA -->|Yes| DeleteAccount[Delete Account]
    ConfirmDeleteA -->|No| ViewAccount
    DeleteAccount --> AccountList

    %% Deposit Transaction
    DepositFlow --> SubmitDeposit[Submit Deposit]
    SubmitDeposit --> DepositSuccess{Success?}
    DepositSuccess -->|Yes| RefreshAccount1[Refresh Account]
    DepositSuccess -->|No| DepositFlow
    RefreshAccount1 --> ViewAccount

    %% Withdraw Transaction
    WithdrawFlow --> CalculateBalance[System Calculates<br/>Ending Balance]
    CalculateBalance --> ShowEndingBalance[Show Preview:<br/>Ending Balance]
    ShowEndingBalance --> ConfirmWithdraw{Confirm<br/>Withdraw?}
    ConfirmWithdraw -->|No| WithdrawFlow
    ConfirmWithdraw -->|Yes| ValidateAmount{Amount Valid?}
    ValidateAmount -->|No - Insufficient| ShowError[Show Error:<br/>Insufficient Balance]
    ShowError --> WithdrawFlow
    ValidateAmount -->|Yes| ProcessWithdraw[Process Withdrawal]
    ProcessWithdraw --> WithdrawSuccess{Success?}
    WithdrawSuccess -->|Yes| RefreshAccount2[Refresh Account]
    WithdrawSuccess -->|No| WithdrawFlow
    RefreshAccount2 --> ViewAccount

    style Start fill:#4ade80,color:#000
    style Homepage fill:#60a5fa,color:#000
    style CustomerList fill:#fbbf24,color:#000
    style AccountList fill:#fbbf24,color:#000
    style DepositoList fill:#fbbf24,color:#000
    style ViewAccount fill:#a78bfa,color:#000
    style ShowEndingBalance fill:#34d399,color:#000
    style ProcessWithdraw fill:#34d399,color:#000
    style CalculateBalance fill:#34d399,color:#000
```

