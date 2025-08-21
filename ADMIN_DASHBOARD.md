# KMA Chatbot Admin Dashboard

This document provides information about the Admin Dashboard that has been added to the KMA Chatbot Frontend system.

## Features

The Admin Dashboard includes the following features:

1. **Usage Statistics**
   - Visualizes API request counts, token usage, response times, and error rates
   - Provides time-based filtering (day, week, month)
   - Shows top users by usage

2. **Conversation Logs**
   - Views user conversation history
   - Filters conversations by date, user, and content
   - Allows detailed inspection of individual conversations

3. **User Management**
   - Create, update, and delete user accounts
   - Manage user roles and permissions
   - Set per-user token and request limits

4. **Rate Limiting**
   - Configure default rate limits for all users
   - Set different limits based on user roles
   - Create exceptions for specific users

5. **LLM Model Management**
   - Enable/disable/switch LLM models
   - Upload new models from directory
   - Adjust model parameters (temperature, top_p, etc.)

## Accessing the Admin Dashboard

The Admin Dashboard is accessible at the `/admin` route. For example:

```
http://localhost:3000/admin
```

## Authentication

Admin access requires admin role credentials. The authentication is handled through the same system as the main application, but checks for the admin role before granting access.

During development, for testing purposes, the system will auto-login as admin for any valid user credentials, but this feature will be disabled in production.

## Integrating with Backend

The admin dashboard is set up to work with mock data for development purposes. To integrate with the real backend:

1. Uncomment the API calls in `src/services/adminService.js` 
2. Ensure that the backend implements the admin API endpoints defined in `src/utils/constants.js`
3. Set up proper authorization on the backend to ensure only admin users can access these endpoints

## API Endpoints

The admin dashboard expects the following API endpoints:

```
/api/admin/users             # CRUD operations for users
/api/admin/rate-limits       # Get and update rate limits
/api/admin/stats             # Get usage statistics
/api/admin/conversations     # Get all conversations
/api/admin/models            # Get available models
/api/admin/models/activate   # Activate a model
/api/admin/models/params     # Update model parameters
/api/admin/models/upload     # Upload a new model
```

## Customization

The dashboard is designed to be customizable. You can:

- Modify the components in `src/components/admin/` to change the UI
- Update the service in `src/services/adminService.js` to change data handling
- Adjust the API endpoints in `src/utils/constants.js` to match your backend
