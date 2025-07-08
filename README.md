# Ray Advertising Test

## To the interviewers
The "backup" folder contains the insomnia collection you can use to test the APIs. You need not bother with the Test folder in that collection. Just hit the APIs under AppUsers and it should work.
I didn't use redis or node-cache to store data as initially, it seemed simpler to use an object and use that as a mock DB. However, I later realized that it forced me to veer off of established ES6 standards so I hope that will not cause problems. I am well aware of what the ES6 standards are and how to use them. I hope I will be forgiven for that for now.

## Contributing Guidelines

Welcome to the **Ray Advertising Test**! We appreciate your interest in contributing to our project. To maintain a high standard of quality and ensure smooth collaboration, please adhere to the following rules and regulations when contributing to this project.

### Table of Contents

- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
  - [Reporting Issues](#reporting-issues)
  - [Creating a Branch](#creating-a-branch)
  - [Making Changes](#making-changes)
  - [Writing Commit Messages](#writing-commit-messages)
  - [Creating a Pull Request (PR)](#creating-a-pull-request-pr)
- [Code Review Process](#code-review-process)
- [Merging PRs](#merging-prs)
- [Collaborating with Team Members](#collaborating-with-team-members)

---

## Getting Started

1. **Clone the Repository**:
   - Clone the repository to your local machine using the following command:
     ```bash
     git clone https://github.com/Ontiktech/ray-advertising-test.git
     ```
2. **Install Dependencies**:
   - Navigate to the project directory and install the required dependencies using your preferred package manager:
     ```bash
     yarn install
     ```

3. **Running the project**:
   - Use the following command to run the project in dev mode
    ```bash
      yarn run dev
    ```
    - To build the project before running production mode, use 
    ```bash
      yarn build
    ```
    - To run in production mode, use
    ```bash
      yarn run start:prod
    ```

## How to Contribute

### Reporting Issues

- **Bug Reports**:
  - Search clicup bugs list to ensure the bug hasn't been reported yet.
  - Create a new bug and provide detailed information, including steps to reproduce the bug, expected behavior, and screenshots if applicable in clickup bug ticket.

### Creating a Branch

- **Branch Naming Convention**:
  - Create a new branch for each feature or bug fix.
  - Use clickup to create the branches. It will automate the ticket tracking process as well
  - Always select main as the source branch
  - Checkout the branch and start making changes
    ```bash
    git checkout -b <branch-name>
    ```

### Making Changes

- **Coding Standards**:
  - Follow the project's coding standards and guidelines.
  - Ensure your code is clean, well-documented, and adheres to the established style.

- **Testing**:
  - Write unit tests for any new functionality you add.
  - Ensure all existing tests pass before submitting your changes.

### Writing Commit Messages

- **Commit Message Format**:
  - Use clear, descriptive commit messages.
  - Follow this structure:
    - `type: short summary (max 50 characters)`
    - `type`: fix, feat, docs, style, refactor, test, chore
  - Example:
    ```bash
    feat: add user authentication module
    ```

- **Detailed Description**:
  - If necessary, include a more detailed explanation of the change in the commit message body.

### Creating a Pull Request (PR)

- **Pull Request Guidelines**:
  - Before creating a PR, ensure your branch is up-to-date with the `main` branch:
    ```bash
    git checkout main
    git pull origin main
    git checkout your-branch
    git merge main
    ```

  - Push your branch to your forked repository:
    ```bash
    git push origin your-branch
    ```

  - Create a PR from your branch to the `main` branch of the original repository.

- **PR Description**:
  - Provide a clear and concise description of the changes made.
  - Reference any related issues or feature requests using keywords like "Closes #123" or "Resolves #456".
  - Include screenshots, if applicable, to show the changes.

## Code Review Process

- **Reviewing PRs**:
  - All PRs will be reviewed by at least one other team member before merging.
  - Be open to feedback and willing to make changes if requested.
  - If your PR is approved, a maintainer will merge it.

- **Review Feedback**:
  - Address any requested changes promptly.
  - Push additional commits to your branch if changes are needed.

## Merging PRs

- **Merge Process**:
  - Only maintainers or authorized team members can merge PRs.
  - PRs should be merged using the "Squash and Merge" strategy to maintain a clean commit history.

- **Closing Issues**:
  - After merging a PR, ensure any associated issues are closed.

## Collaborating with Team Members

- **Communication**:
  - Use the project's communication channels (e.g., Slack, Discord, or the project's GitHub Discussions) to collaborate with team members.
  - Keep discussions respectful and constructive.

- **Pair Programming**:
  - If possible, consider pair programming for complex features or when tackling significant refactors.

- **Documentation**:
  - Update the documentation to reflect any changes you make to the codebase.
  - Document any new features, configuration options, or breaking changes.

<!-- ## License

By contributing to this project, you agree that your contributions will be licensed under the [LICENSE](link_to_license_file) file in the repository. -->

---

Thank you for contributing to **Ray Advertising Test**! Your efforts help make this project better for everyone. Happy coding! 🎉