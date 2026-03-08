# Requirements — Adiyogi AI Education

## Project Title
Adiyogi AI Education — Learn Anything For Free

## Problem Statement
850M+ Indians cannot afford paid learning platforms like Seekho, Unacademy, etc. World-class free educational content exists scattered across YouTube, NPTEL, MIT OCW, Khan Academy, and SWAYAM, but learners face three critical barriers:
- They don't know WHAT to learn, in WHAT order, or from WHERE
- - Most structured courses are only available in English (language barrier)
  - - 65% of Indian self-learners drop out in the first week due to lack of structure
   
    - The content exists. The structure doesn't.
   
    - ## Proposed Solution
    - Adiyogi AI Education is a voice-first AI platform that organizes free education from YouTube, Instagram, NPTEL, and open universities across the world for every Indian. It provides:
    - 1. Voice-first interface — users speak or type in any Indian language
      2. 2. AI-generated structured course plans from the best FREE resources
         3. 3. Content curated from YouTube, NPTEL, MIT OCW, Khan Academy, SWAYAM
            4. 4. Hindi/regional language prioritization with translate-on-demand
               5. 5. Multi-platform delivery via Web, WhatsApp, Messenger, and Telegram
                 
                  6. ## Target Users
                  7. - 850M+ Indians who cannot afford paid learning platforms
                     - - Students in tier-2/tier-3 cities and rural areas
                       - - Self-learners looking for structured free education
                         - - Non-English speaking learners across India
                          
                           - ## Functional Requirements
                          
                           - ### FR-1: Voice Input & Speech-to-Text
                           - - Accept voice input in 11 Indian languages via Sarvam AI
                             - - Convert speech to text for processing by AI engine
                              
                               - ### FR-2: AI Course Plan Generation
                               - - Use Amazon Bedrock (LLMs) to generate personalized, structured course plans
                                 - - Plans should include topic sequencing, estimated duration, and learning objectives
                                  
                                   - ### FR-3: Free Content Aggregation
                                   - - Aggregate and rank free educational content from YouTube, NPTEL, MIT OCW, Khan Academy, and SWAYAM
                                     - - Use Amazon Q for content discovery and recommendation
                                      
                                       - ### FR-4: Vernacular/Regional Language Support
                                       - - Prioritize Hindi and regional language content when available
                                         - - Translate course plans and summaries on demand using Sarvam AI
                                           - - Text-to-speech output in user's preferred Indian language
                                            
                                             - ### FR-5: Multi-Platform Delivery
                                             - - Web application (React/Next.js)
                                               - - WhatsApp integration via webhook
                                                 - - Telegram bot integration
                                                   - - Facebook Messenger integration
                                                     - - Reduce app download dependency
                                                      
                                                       - ### FR-6: User Progress Tracking
                                                       - - Track learning progress and preferences per user
                                                         - - Store data in Amazon DynamoDB
                                                          
                                                           - ## Non-Functional Requirements
                                                          
                                                           - ### NFR-1: Scalability
                                                           - - Serverless architecture using AWS Lambda for webhook handlers
                                                             - - CloudFront CDN for web app delivery
                                                               - - Must support concurrent users across multiple messaging platforms
                                                                
                                                                 - ### NFR-2: Performance
                                                                 - - Course plan generation in under 10 seconds
                                                                   - - Voice-to-text conversion in near real-time
                                                                     - - Content recommendations cached in Amazon S3
                                                                      
                                                                       - ### NFR-3: Cost Efficiency
                                                                       - - 100% free for end users (zero cost)
                                                                         - - Serverless infrastructure to minimize operational costs
                                                                           - - Use free-tier AWS services where possible
                                                                            
                                                                             - ### NFR-4: Accessibility
                                                                             - - Voice-first design for low-literacy users
                                                                               - - Works on low-bandwidth connections
                                                                                 - - Compatible with basic smartphones
                                                                                  
                                                                                   - ### NFR-5: Security & Privacy
                                                                                   - - User data encrypted at rest and in transit
                                                                                     - - Minimal personal data collection
                                                                                       - - Compliance with Indian data protection guidelines
                                                                                        
                                                                                         - ## AWS Services Used
                                                                                         - | Service | Purpose |
                                                                                         - |---------|---------|
                                                                                         - | Amazon Bedrock | AI-powered custom course plan generation using LLMs |
                                                                                         - | Amazon Q | Content discovery and recommendation enhancement |
                                                                                         - | AWS Lambda | Serverless webhook handlers for messaging platforms |
                                                                                         - | Amazon DynamoDB | User progress tracking and preferences |
                                                                                         - | Amazon S3 | Content metadata caching |
                                                                                         - | Amazon CloudFront | Web app CDN delivery |
                                                                                        
                                                                                         - ## Future Sustainability
                                                                                         - - Freemium mentorship model (AI = free, human = paid)
                                                                                           - - Certificate partnerships with NPTEL/SWAYAM
                                                                                             - - Corporate sponsorships
                                                                                               - - Marketplace for paid courses + Ads
                                                                                                
                                                                                                 - ## Team
                                                                                                 - - Aditya Gupta (Solo / Team Lead)
                                                                                                  
                                                                                                   - ## Track
                                                                                                   - Professional Track — AI for Bharat Hackathon (Hack2Skill + AWS)
