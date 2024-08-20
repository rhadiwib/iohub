# IOHub Social Media App

IOHub is a modern social media platform built with React and Appwrite, featuring real-time updates and a "Stories" feature similar to popular social networking apps.

## Features

- User Authentication (Sign up, Login, Logout)
- Create and View Posts
- Stories feature (posts visible for 24 hours)
- Real-time Updates for New Posts
- Like and Save Posts
- User Profiles
- Explore Page with Search Functionality
- Infinite Scrolling for Posts
- Responsive Design

## Technologies Used

- Frontend:
  - React.js
  - React Router for navigation
  - React Query for data fetching and caching
  - Tailwind CSS for styling
  - Shadcn UI components

- Backend:
  - Appwrite (Backend as a Service)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm or yarn
- An Appwrite instance set up (local or cloud)

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-username/IOHub-social-media.git
   cd IOHub-social-media
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your Appwrite configuration:
   - Create a `.env` file in the root directory
   - Add your Appwrite endpoint and project ID:
     ```
     VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
     VITE_APPWRITE_PROJECT_ID=your_project_id
     ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## Project Structure

```
src/
├── _auth/
│   └── forms/
├── _root/
│   └── pages/
├── components/
│   ├── forms/
│   ├── shared/
│   └── ui/
├── constants/
├── context/
├── hooks/
├── lib/
│   ├── appwrite/
│   ├── react-query/
│   └── validation/
└── types/
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the Appwrite team for providing an excellent Backend as a Service platform.
- Shadcn UI for the beautiful and customizable UI components.
- All contributors and supporters of this project.

## Showcase

### Home
![Home](https://raw.githubusercontent.com/rhadiwib/iohub/main/public/assets/showcase/iohub-home.png)

### Create Post
![Create Post](https://raw.githubusercontent.com/rhadiwib/iohub/main/public/assets/showcase/iohub-create-post.png)

### Edit User Profile
![Edit User Profile](https://raw.githubusercontent.com/rhadiwib/iohub/main/public/assets/showcase/iohub-edit-user-profile.png)

### Explore
![Explore](https://raw.githubusercontent.com/rhadiwib/iohub/main/public/assets/showcase/iohub-explore.png)

### Follow
![Follow](https://raw.githubusercontent.com/rhadiwib/iohub/main/public/assets/showcase/iohub-follow-user.png)

### Home User
![Home User](https://raw.githubusercontent.com/rhadiwib/iohub/main/public/assets/showcase/iohub-home-user.png)

### People
![People](https://raw.githubusercontent.com/rhadiwib/iohub/main/public/assets/showcase/iohub-people.png)

### Signup
![Signup](https://raw.githubusercontent.com/rhadiwib/iohub/main/public/assets/showcase/iohub-signup.png)