# Design Document — Adiyogi AI Education

## 1. Overview
Adiyogi AI Education is an AI-powered, voice-first learning platform that curates free educational content from open sources (YouTube, NPTEL, MIT OCW, Khan Academy, SWAYAM) and delivers personalized, structured course plans in Indian languages. The platform is built on AWS and designed to serve 850M+ Indians who cannot afford paid learning platforms.

## 2. Architecture Overview

### 2.1 High-Level Architecture

```
User (Voice/Text in Indian Language)
        |
        v
+-------------------+
| Client Layer      |
| - Web App         |
| - WhatsApp Bot    |
| - Telegram Bot    |
| - Messenger Bot   |
+-------------------+
        |
        v
+-------------------+
| API Gateway /     |
| AWS Lambda        |
| (Webhook Handler) |
+-------------------+
        |
        v
+-------------------+
| Sarvam AI Layer   |
| - Speech-to-Text  |
| - Text-to-Speech  |
| - Translation     |
| (11 Indian langs) |
+-------------------+
        |
        v
+-------------------+
| AI Engine         |
| - Amazon Bedrock  |
|   (Course Plan    |
|    Generation)    |
| - Amazon Q        |
|   (Content        |
|    Discovery)     |
+-------------------+
        |
        v
+-------------------+
| Content Layer     |
| - YouTube API     |
| - NPTEL Catalog   |
| - MIT OCW         |
| - Khan Academy    |
| - SWAYAM          |
+-------------------+
        |
        v
+-------------------+
| Data Layer        |
| - DynamoDB        |
|   (User Progress) |
| - S3 (Metadata    |
|   Cache)          |
| - CloudFront CDN  |
+-------------------+
```

### 2.2 Data Flow
1. User sends a voice or text message in their preferred Indian language via any supported platform (Web, WhatsApp, Telegram, Messenger)
2. 2. AWS Lambda webhook handler receives the request
   3. 3. Sarvam AI converts speech to text (supports 11 Indian languages)
      4. 4. Amazon Bedrock processes the query and generates a personalized course plan using LLMs
         5. 5. Amazon Q enhances content discovery and recommends the best free resources
            6. 6. Content layer fetches and ranks resources from YouTube, NPTEL, MIT OCW, Khan Academy, SWAYAM
               7. 7. Sarvam AI translates the course plan and reads it aloud in the user's language
                  8. 8. Response delivered back to user via their chosen platform
                    
                     9. ## 3. Component Design
                    
                     10. ### 3.1 Client Layer
                     11. - **Web Application**: Built with React/Next.js, served via CloudFront CDN
                         - - **WhatsApp Integration**: Webhook-based integration using WhatsApp Business API via AWS Lambda
                           - - **Telegram Bot**: Bot API integration via AWS Lambda webhook handler
                             - - **Messenger Bot**: Facebook Messenger Platform integration via AWS Lambda
                              
                               - ### 3.2 Voice & Language Layer (Sarvam AI)
                               - - **Speech-to-Text (STT)**: Converts voice input in 11 Indian languages to text
                                 - - **Text-to-Speech (TTS)**: Reads course plans aloud in user's preferred language
                                   - - **Auto-Translation**: Translates course content and plans on demand
                                     - - **Supported Languages**: Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, Urdu (and more)
                                      
                                       - ### 3.3 AI Engine
                                      
                                       - #### 3.3.1 Amazon Bedrock — Course Plan Generator
                                       - - Accepts user query (e.g., "I want to learn machine learning from scratch")
                                         - - Generates a structured course plan with:
                                           -   - Topic sequencing (beginner to advanced)
                                               -   - Estimated time per module
                                                   -   - Learning objectives per section
                                                       -   - Mapped free resources for each topic
                                                        
                                                           - #### 3.3.2 Amazon Q — Content Discovery
                                                           - - Searches and ranks free educational content across multiple platforms
                                                             - - Considers content quality, language availability, and user preferences
                                                               - - Enhances recommendation accuracy over time
                                                                
                                                                 - ### 3.4 Content Aggregation Layer
                                                                 - - **YouTube API**: Fetches relevant educational videos, playlists, and channels
                                                                   - - **NPTEL Catalog**: 60,000+ hours of free engineering and science content
                                                                     - - **MIT OCW**: Open courseware from MIT
                                                                       - - **Khan Academy**: Free courses across subjects
                                                                         - - **SWAYAM**: Government of India's MOOC platform
                                                                          
                                                                           - Content is ranked by relevance, language match, quality signals, and recency.
                                                                          
                                                                           - ### 3.5 Data Layer
                                                                           - - **Amazon DynamoDB**: Stores user profiles, learning progress, preferences, and session history
                                                                             - - **Amazon S3**: Caches content metadata (video titles, descriptions, durations, thumbnails) to reduce API calls
                                                                               - - **Amazon CloudFront**: CDN for serving the web application globally with low latency
                                                                                
                                                                                 - ## 4. Key Design Decisions
                                                                                
                                                                                 - ### 4.1 Voice-First Approach
                                                                                 - Designed for users with low literacy or those more comfortable speaking than typing. This is critical for Bharat (rural India) adoption.
                                                                                
                                                                                 - ### 4.2 Zero App Download Strategy
                                                                                 - Delivered via WhatsApp, Telegram, Messenger, and web browser to eliminate the friction of app downloads. India has 500M+ WhatsApp users — meeting users where they already are.
                                                                                
                                                                                 - ### 4.3 Free Content Only
                                                                                 - We don't create content. We organize the internet's best free education with AI. This keeps the platform 100% free for learners while leveraging existing high-quality content.
                                                                                
                                                                                 - ### 4.4 Serverless Architecture
                                                                                 - AWS Lambda-based serverless design ensures cost efficiency (pay per use), automatic scaling, and zero server management overhead.
                                                                                
                                                                                 - ### 4.5 Vernacular First
                                                                                 - Hindi and regional languages are prioritized in content selection and delivery. English content is auto-translated when no vernacular alternative exists.
                                                                                
                                                                                 - ## 5. Database Schema (DynamoDB)
                                                                                
                                                                                 - ### Users Table
                                                                                 - | Attribute | Type | Description |
                                                                                 - |-----------|------|-------------|
                                                                                 - | userId | String (PK) | Unique user identifier |
                                                                                 - | platform | String | web / whatsapp / telegram / messenger |
                                                                                 - | preferredLanguage | String | User's preferred language |
                                                                                 - | createdAt | Number | Account creation timestamp |
                                                                                
                                                                                 - ### CoursePlans Table
                                                                                 - | Attribute | Type | Description |
                                                                                 - |-----------|------|-------------|
                                                                                 - | planId | String (PK) | Unique plan identifier |
                                                                                 - | userId | String (SK) | Associated user |
                                                                                 - | query | String | Original user query |
                                                                                 - | plan | Map | Structured course plan JSON |
                                                                                 - | createdAt | Number | Plan creation timestamp |
                                                                                
                                                                                 - ### Progress Table
                                                                                 - | Attribute | Type | Description |
                                                                                 - |-----------|------|-------------|
                                                                                 - | userId | String (PK) | User identifier |
                                                                                 - | planId | String (SK) | Associated course plan |
                                                                                 - | completedModules | List | List of completed module IDs |
                                                                                 - | lastAccessedAt | Number | Last activity timestamp |
                                                                                
                                                                                 - ## 6. API Design

                                                                                 ### POST /api/query
                                                                                 Accepts user query (voice or text), generates a course plan.
                                                                                 - Input: `{ "userId": "...", "query": "...", "language": "hi", "inputType": "voice|text" }`
                                                                                 - - Output: `{ "planId": "...", "plan": { ... }, "audioUrl": "..." }`
                                                                                  
                                                                                   - ### GET /api/plan/:planId
                                                                                   - Retrieves a previously generated course plan.
                                                                                  
                                                                                   - ### POST /api/progress
                                                                                   - Updates user's learning progress.
                                                                                   - - Input: `{ "userId": "...", "planId": "...", "moduleId": "...", "status": "completed" }`
                                                                                    
                                                                                     - ### GET /api/progress/:userId
                                                                                     - Gets user's overall learning progress across all plans.
                                                                                    
                                                                                     - ## 7. Deployment Architecture
                                                                                     - - **AWS Lambda**: All backend logic (webhook handlers, API endpoints)
                                                                                       - - **Amazon API Gateway**: REST API management
                                                                                         - - **Amazon S3 + CloudFront**: Static web app hosting and CDN
                                                                                           - - **Amazon DynamoDB**: NoSQL database for all persistent data
                                                                                             - - **Amazon Bedrock**: LLM inference for course plan generation
                                                                                               - - **Amazon Q**: Content search and discovery
                                                                                                
                                                                                                 - ## 8. Security Design
                                                                                                 - - All API endpoints behind API Gateway with throttling and rate limiting
                                                                                                   - - User data encrypted at rest (DynamoDB encryption) and in transit (TLS)
                                                                                                     - - Minimal PII collection — only platform ID and language preference
                                                                                                       - - No payment data stored (platform is 100% free)
                                                                                                         - - Lambda functions follow least-privilege IAM policies
                                                                                                          
                                                                                                           - ## 9. Scalability Considerations
                                                                                                           - - Serverless architecture auto-scales with demand
                                                                                                             - - DynamoDB on-demand capacity for unpredictable traffic patterns
                                                                                                               - - CloudFront caching reduces origin load
                                                                                                                 - - S3 content metadata cache reduces external API calls
                                                                                                                   - - Stateless Lambda functions enable horizontal scaling
                                                                                                                    
                                                                                                                     - ## 10. Future Enhancements
                                                                                                                     - - Offline mode for low-connectivity areas
                                                                                                                       - - Peer learning and study groups
                                                                                                                         - - AI-powered quizzes and assessments
                                                                                                                           - - Certificate partnerships with NPTEL/SWAYAM
                                                                                                                             - - Freemium human mentorship marketplace
                                                                                                                               - - Corporate sponsorship integration
