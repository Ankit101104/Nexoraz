import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Drawer,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Button,
  Chip,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Help as HelpIcon,
  Add as AddIcon,
  AutoGraph as AutoGraphIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Add greetings and common responses
const greetings = {
  'hello': ["Hi there! 👋 How can I help you today?", "Hello! Welcome to NEXORAZ. What can I do for you?"],
  'hi': ["Hey! 👋 How can I assist you?", "Hi! What would you like to know about NEXORAZ?"],
  'hey': ["Hello! 😊 How can I help?", "Hey there! What can I do for you today?"],
  'good morning': ["Good morning! ☀️ How can I assist you today?", "Morning! How may I help you?"],
  'good afternoon': ["Good afternoon! 🌤️ How can I help you today?", "Afternoon! What can I do for you?"],
  'good evening': ["Good evening! 🌙 How may I assist you?", "Evening! How can I help you today?"],
  'thanks': ["You're welcome! 😊 Let me know if you need anything else!", "Happy to help! 🌟 Feel free to ask more questions!"],
  'thank you': ["You're welcome! 😊 Is there anything else you'd like to know?", "Glad I could help! 🌟 Let me know if you need more assistance!"],
  'bye': ["Goodbye! 👋 Have a great day!", "Bye! Feel free to come back if you have more questions! 😊"],
  'goodbye': ["Take care! 👋 Come back anytime!", "Goodbye! Have a wonderful day! 😊"],
};

const commonPhrases = {
  'how are you': "I'm doing great, thanks for asking! 😊 How can I help you today?",
  'who are you': "I'm the NEXORAZ Assistant, here to help you with any questions about our platform! 🤖",
  'what can you do': "I can help you with:\n✨ Creating and managing graphs\n📊 Using platform features\n👥 Collaboration\n🔧 Technical support\n💡 And much more!\n\nWhat would you like to know about?",
  'help': "I'd be happy to help! Here are some common topics:\n📈 Graph creation\n🔗 Adding nodes & connections\n👥 Sharing & collaboration\n⚙️ Account settings\n\nWhat would you like to learn more about?",
  'features': "Here are NEXORAZ's main features:\n✨ Dynamic graph creation\n🤖 AI-powered insights\n👥 Real-time collaboration\n🎨 Interactive visualization\n🔍 Advanced search\n\nWould you like details about any specific feature?",
};

const predefinedAnswers = {
  'how to create a graph': 'To create a new graph:\n1. Go to Dashboard\n2. Click "Create New Graph"\n3. Enter title and description\n4. Start adding nodes and connections',
  
  'how to add nodes': 'To add nodes to your graph:\n1. Open your graph\n2. Click the "+" button\n3. Choose node type\n4. Enter node details',
  
  'how to connect nodes': 'To connect nodes:\n1. Click on the source node\n2. Hold and drag to the target node\n3. Enter the relationship type\n4. Click save',
  
  'what is nexoraz': 'NEXORAZ is a dynamic knowledge graph platform that helps you visualize and manage complex information through interactive graphs. It features AI-powered insights and real-time collaboration.',
  
  'how to share graphs': 'To share your graph:\n1. Open the graph\n2. Click the "Share" button\n3. Choose sharing permissions\n4. Copy and share the link',
  
  'pricing': 'NEXORAZ is currently free to use during our beta phase. Stay tuned for our premium features!',
  
  'forgot password': 'To reset your password:\n1. Go to Login page\n2. Click "Forgot Password"\n3. Enter your email\n4. Follow instructions sent to your email',
  
  'graph features': 'NEXORAZ graphs feature:\n- Dynamic node creation\n- Real-time collaboration\n- AI-powered insights\n- Interactive visualization\n- Custom node types\n- Relationship mapping\n- Search functionality\n- Export options',
  
  'graph types': 'You can create different types of graphs:\n- Concept Maps\n- Process Flows\n- Organization Charts\n- Knowledge Networks\n- Research Maps\n- Project Dependencies',
  
  'node types': 'Available node types include:\n- Concepts\n- Processes\n- People\n- Organizations\n- Events\n- Locations\n- Documents\nEach type has unique properties and visualization options.',
  
  'collaboration': 'To collaborate on a graph:\n1. Open the graph\n2. Click "Share"\n3. Invite team members via email\n4. Set permissions (view/edit)\n5. Team members can join and work together in real-time',
  
  'share graphs': 'To share your graph:\n1. Open the graph\n2. Click the "Share" button\n3. Choose sharing permissions\n4. Copy and share the link',
  
  'create account': 'To create an account:\n1. Click "Register" on the homepage\n2. Enter your email and password\n3. Verify your email\n4. Complete your profile',
  
  'change password': 'To change your password:\n1. Go to Profile Settings\n2. Click "Security"\n3. Enter current password\n4. Enter and confirm new password',
  
  'get help': 'Need help? You can:\n1. Check our documentation\n2. Contact support\n3. Join our community forum\n4. Watch tutorial videos\n5. Schedule a demo',
  
  'contact support': 'To contact support:\n1. Email: support@nexoraz.com\n2. Live chat: Available 24/7\n3. Phone: +1-XXX-XXX-XXXX\n4. Visit our Help Center',
  
  'pricing': 'NEXORAZ is currently free to use during our beta phase. Our upcoming plans will include:\n- Free: Basic features\n- Pro: Advanced features\n- Enterprise: Custom solutions',
  
  'search': 'To search within a graph:\n1. Use the search bar at the top\n2. Enter keywords or node names\n3. Use filters for specific types\n4. Click results to navigate',
  
  'export': 'To export your graph:\n1. Open the graph\n2. Click "Export"\n3. Choose format (PNG, PDF, JSON)\n4. Download the file',
  
  'customize': 'To customize your graph:\n1. Select nodes/edges\n2. Use the style panel\n3. Change colors, sizes, fonts\n4. Save custom themes',
  
  'ai features': 'NEXORAZ AI features:\n- Automatic node suggestions\n- Relationship analysis\n- Pattern detection\n- Knowledge extraction\n- Smart layouts\n- Content recommendations',
  
  'loading issues': 'If your graph is loading slowly:\n1. Check your internet connection\n2. Clear browser cache\n3. Reduce graph complexity\n4. Try a different browser',
  
  'save error': 'If you cannot save:\n1. Check your internet connection\n2. Ensure you have edit permissions\n3. Try saving smaller changes\n4. Contact support if persistent',
  
  // Add more conversational alternatives
  'i need help': "I'm here to help! 😊 What specific aspect of NEXORAZ would you like assistance with?\n\nYou can ask about:\n📊 Creating graphs\n🔗 Managing connections\n👥 Collaboration\n⚙️ Settings",
  
  'not working': "I'm sorry to hear that! 😟 To help you better, could you tell me:\n1. What specific feature isn't working?\n2. What were you trying to do?\n3. Any error messages you saw?",
  
  'confused': "Don't worry! 😊 Let's break it down. What specific part of NEXORAZ are you having trouble with?\n\nI can help with:\n- Basic navigation\n- Graph creation\n- Feature explanations",
  
  'stuck': "No problem! 🌟 Let's figure this out together. What were you trying to do when you got stuck?",
  
  'how do i start': "Welcome to NEXORAZ! 🚀 Here's how to get started:\n1. Create an account\n2. Explore the dashboard\n3. Create your first graph\n4. Add nodes and connections\n\nWould you like details about any of these steps?",
  
  'recommend': "I'll analyze your needs and provide personalized recommendations! 🤖\nWhat type of graph are you working on?",
  
  'analyze': "I can help analyze your graph and suggest improvements! 📊\nWhat specific aspects would you like me to look at?",
  
  'suggest': "I'd be happy to make some suggestions! 💡\nAre you looking for:\n1. Graph structure ideas\n2. Node type recommendations\n3. Visualization tips\n4. Best practices",
  
  'who created nexoraz': "NEXORAZ was created by Mr. Rohit Prajapat, a visionary in knowledge graph technology. 🚀\n\nAs founder and CEO, he leads our mission to revolutionize how people visualize and understand complex information.",
  
  'who is the founder': "Mr. Rohit Prajapat is the founder and CEO of NEXORAZ. 👨‍💼\n\nHe established NEXORAZ with the vision of transforming knowledge management through innovative graph visualization and AI integration.",
  
  'about rohit': "Mr. Rohit Prajapat is the founder and CEO of NEXORAZ. 👨‍💼\n\nHe's a technology innovator focused on:\n✨ Knowledge Graph Technology\n🤖 AI Integration\n📊 Data Visualization\n🔗 Information Management\n\nYou can connect with him on:\n📧 Email: contactnexoraz@gmail.com\n🔗 LinkedIn: /in/rohit-prajapat-878bb2255\n🐦 Twitter: @nexoraz_",
  
  'contact rohit': "You can reach Mr. Rohit Prajapat through:\n\n📧 Email: contactnexoraz@gmail.com\n🔗 LinkedIn: linkedin.com/in/rohit-prajapat-878bb2255\n🐦 Twitter: @nexoraz_\n\nHe's always interested in hearing from users and discussing potential collaborations!",
  
  'company info': "About NEXORAZ:\n\n👨‍💼 Founded by: Mr. Rohit Prajapat\n📍 Location: Vadodara, India\n🌐 Website: nexoraz.com\n📧 Contact: contactnexoraz@gmail.com\n\nOur mission is to revolutionize knowledge visualization and management through innovative graph technology and AI integration.",
  
  'where is nexoraz': "NEXORAZ is based in Vadodara, India 📍\n\nFounded by Mr. Rohit Prajapat, we're building the future of knowledge visualization from the heart of Gujarat!",
  
  'when was nexoraz founded': "NEXORAZ was founded in 2023 by Mr. Rohit Prajapat 📅\n\nSince then, we've been dedicated to revolutionizing knowledge visualization and management.",
};

// Add more graph-specific responses
const graphSpecificAnswers = {
  'graph types': `Our Knowledge Graph supports various types:\n
  📊 Concept Maps - For organizing ideas and concepts
  🔄 Process Flows - For visualizing workflows
  👥 Organization Charts - For hierarchical structures
  🎯 Project Dependencies - For task relationships
  🧠 Research Maps - For academic research
  🌐 Knowledge Networks - For complex relationships\n
  Which type interests you?`,

  'node connections': `To create meaningful connections in your graph:\n
  1. Click on the source node
  2. Drag to create a connection
  3. Select the relationship type:
     - "is part of"
     - "relates to"
     - "depends on"
     - "influences"
     - "causes"
  4. Add optional description
  5. Click Save\n
  Need more specific help?`,

  'graph analysis': `I can help analyze your graph for:\n
  📈 Node Distribution
  🔗 Connection Patterns
  🎯 Central Concepts
  🔍 Knowledge Gaps
  📊 Structural Balance\n
  What would you like to analyze?`,

  'graph tips': `Pro tips for better knowledge graphs:\n
  1. Start with a central concept
  2. Use clear, concise node labels
  3. Create meaningful relationships
  4. Group related nodes together
  5. Use different node types for clarity
  6. Add descriptions for complex concepts
  7. Regular reorganize for clarity\n
  Want specific examples?`,

  'visualization options': `Customize your graph visualization:\n
  🎨 Node Colors - By type or category
  📏 Node Size - By importance
  🔤 Font Styles - For readability
  ↔️ Layout Options:
    - Force-directed
    - Hierarchical
    - Circular
    - Grid\n
  Which aspect would you like to customize?`,

  'export graph': `Export your knowledge graph:\n
  1. 📸 PNG - For presentations
  2. 📄 PDF - For documentation
  3. 📊 JSON - For data backup
  4. 📎 CSV - For spreadsheet analysis\n
  Choose format and click Export in graph controls.`,

  'graph privacy': `Manage graph privacy:\n
  🔒 Private - Only you can access
  👥 Shared - Specific users can view/edit
  🌐 Public - Anyone with link can view\n
  Current setting shown in graph settings.`,

  'graph collaboration': `Collaborate on your graph:\n
  1. Share graph link
  2. Set permissions:
     - View only
     - Edit nodes
     - Full access
  3. Real-time updates
  4. Comment on nodes
  5. Track changes\n
  Need help with sharing?`,

  'graph templates': `Start with our templates:\n
  📚 Academic Research
  💼 Project Management
  🎓 Study Notes
  💡 Brainstorming
  🏢 Organization Structure\n
  Want to try a template?`,

  'search in graph': `Search your graph effectively:\n
  1. Use the search bar (Ctrl+F)
  2. Filter by:
     - Node type
     - Creation date
     - Connections
     - Keywords
  3. Click to highlight results
  4. Use advanced filters\n
  Need search examples?`,

  'graph shortcuts': `Keyboard shortcuts for faster work:\n
  Ctrl+N - New node
  Ctrl+E - New edge
  Ctrl+F - Search
  Ctrl+Z - Undo
  Ctrl+S - Save
  Space - Center graph
  +/- - Zoom in/out\n
  Want the full list?`,

  'graph limits': `Free account limits:\n
  - 10 graphs per day
  - 100 nodes per graph
  - Basic templates
  - Standard layouts\n
  Upgrade to Premium for unlimited access!`,

  'premium features': `Premium features include:\n
  ✨ Unlimited graphs
  🎨 Advanced templates
  🤖 AI-powered insights
  📊 Advanced analytics
  🔄 Version history
  🔗 API access\n
  Interested in upgrading?`
};

const Message = ({ text, isBot, timestamp, isHelp }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      mb: 2,
      flexDirection: isBot ? 'row' : 'row-reverse',
    }}
  >
    <Avatar
      sx={{
        bgcolor: isBot ? '#64ffda' : '#233554',
        width: 32,
        height: 32,
        mr: isBot ? 1 : 0,
        ml: isBot ? 0 : 1,
      }}
    >
      {isBot ? 'N' : 'U'}
    </Avatar>
    <Paper
      sx={{
        p: 2,
        maxWidth: '70%',
        bgcolor: isBot ? '#112240' : '#1a365d',
        borderRadius: 2,
      }}
    >
      <Typography color="#ccd6f6" sx={{ whiteSpace: 'pre-line' }}>
        {text}
      </Typography>
      {isHelp && (
        <Button
          variant="contained"
          size="small"
          startIcon={<HelpIcon />}
          onClick={() => window.location.href = '/contact'}
          sx={{
            mt: 2,
            bgcolor: '#64ffda',
            color: '#0a192f',
            '&:hover': { bgcolor: '#4caf50' },
          }}
        >
          Contact Support
        </Button>
      )}
      <Typography variant="caption" color="#8892b0" display="block" mt={1}>
        {new Date(timestamp).toLocaleTimeString()}
      </Typography>
    </Paper>
  </Box>
);

// Add QuickActionButton component
const QuickActionButton = ({ label, icon, onClick }) => (
  <Button
    variant="outlined"
    size="small"
    startIcon={icon}
    onClick={onClick}
    sx={{
      m: 0.5,
      color: '#64ffda',
      borderColor: '#233554',
      '&:hover': {
        borderColor: '#64ffda',
        bgcolor: 'rgba(100, 255, 218, 0.1)',
      },
    }}
  >
    {label}
  </Button>
);

// Add GraphLoadingIndicator component
const GraphLoadingIndicator = () => (
  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Box sx={{ position: 'relative', width: 120, height: 80 }}>
      {/* Central Node */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#64ffda',
        }}
      />
      
      {/* Satellite Nodes */}
      {[0, 72, 144, 216, 288].map((degree, index) => (
        <motion.div
          key={index}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            left: `${50 + 35 * Math.cos(degree * Math.PI / 180)}%`,
            top: `${50 + 35 * Math.sin(degree * Math.PI / 180)}%`,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#64ffda',
          }}
        />
      ))}
      
      {/* Connecting Lines */}
      {[0, 72, 144, 216, 288].map((degree, index) => (
        <motion.div
          key={`line-${index}`}
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 35,
            height: 2,
            background: '#64ffda',
            transformOrigin: '0% 50%',
            transform: `rotate(${degree}deg)`,
          }}
        />
      ))}
    </Box>
  </Box>
);

// Add AI integration
const processWithAI = async (userInput, conversationHistory, graphContext) => {
  try {
    const response = await axios.post('/api/chat/process', {
      input: userInput,
      history: conversationHistory,
      context: {
        currentGraph: graphContext,
        userPreferences: getUserPreferences(),
        graphComplexity: calculateGraphComplexity(graphContext),
        timestamp: new Date().toISOString()
      }
    });
    return response.data.response;
  } catch (error) {
    console.error('AI processing error:', error);
    return findBestMatch(userInput); // Fallback to predefined responses
  }
};

// Add helper functions
const calculateGraphComplexity = (graph) => {
  if (!graph) return 'simple';
  const nodeCount = graph.nodes?.length || 0;
  const edgeCount = graph.edges?.length || 0;
  
  if (nodeCount > 50 || edgeCount > 100) return 'complex';
  if (nodeCount > 20 || edgeCount > 40) return 'moderate';
  return 'simple';
};

const getUserPreferences = () => {
  return {
    layout: localStorage.getItem('preferredLayout') || 'force',
    theme: localStorage.getItem('preferredTheme') || 'dark',
    nodeSize: localStorage.getItem('preferredNodeSize') || 'medium',
    edgeStyle: localStorage.getItem('preferredEdgeStyle') || 'curved'
  };
};

const getRandomResponse = (responses) => {
  if (Array.isArray(responses)) {
    return responses[Math.floor(Math.random() * responses.length)];
  }
  return responses;
};

const findBestMatch = (input) => {
  const userQuestion = input.toLowerCase();

  // Check for graph-specific answers first
  for (const [key, value] of Object.entries(graphSpecificAnswers)) {
    if (userQuestion.includes(key)) {
      return value;
    }
  }

  // Check for greetings
  for (const [key, value] of Object.entries(greetings)) {
    if (userQuestion.includes(key)) {
      return getRandomResponse(value);
    }
  }

  // Check for common phrases
  for (const [key, value] of Object.entries(commonPhrases)) {
    if (userQuestion.includes(key)) {
      return value;
    }
  }

  // Check predefined answers
  for (const [key, value] of Object.entries(predefinedAnswers)) {
    if (userQuestion.includes(key)) {
      return value;
    }
  }

  // Fallback response
  return `I'm here to help with your knowledge graph! 🤔\n
Could you be more specific about what you need?\n
You can ask about:
📊 Graph creation and types
🔗 Node connections
🎨 Visualization options
👥 Collaboration features
🔍 Search and navigation
⚙️ Settings and customization\n
Or type 'help' for a full list of topics!`;
};

const determineCategory = (input) => {
  const text = input.toLowerCase();
  
  if (text.includes('graph') || text.includes('node') || text.includes('edge') || text.includes('connection')) {
    return 'graphs';
  }
  if (text.includes('visualize') || text.includes('display') || text.includes('show') || text.includes('layout')) {
    return 'visualization';
  }
  if (text.includes('share') || text.includes('team') || text.includes('collaborate')) {
    return 'collaboration';
  }
  if (text.includes('setting') || text.includes('config') || text.includes('preference')) {
    return 'settings';
  }
  if (text.includes('node') || text.includes('connect') || text.includes('relationship')) {
    return 'nodes';
  }
  return 'general';
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: `Welcome to NEXORAZ Knowledge Graph Assistant!\n
I'm here to help you create and manage your knowledge graphs.\n
You can ask me about:
📊 Creating different types of graphs
🔗 Adding nodes and connections
🎨 Customizing visualizations
👥 Collaborating with others
🔍 Searching and analyzing
⚙️ Settings and features\n
Just type your question, and I'll guide you! 😊`,
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const currentGraph = useSelector(state => state.graph.currentGraph);
  const [isTyping, setIsTyping] = useState(false);
  const [messageCategory, setMessageCategory] = useState('general');
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    'How do I create a new graph?',
    'What are the different node types?',
    'How can I share my graph?',
    'Tell me about premium features'
  ]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [aiEnabled, setAiEnabled] = useState(true);

  // Add categories for better organization
  const messageCategories = {
    general: '💬 General',
    graphs: '📊 Graphs',
    nodes: '🔗 Nodes',
    visualization: '🎨 Visualization',
    collaboration: '👥 Collaboration',
    settings: '⚙️ Settings'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIRecommendations = async (query) => {
    try {
      setIsAnalyzing(true);
      const response = await axios.post('/api/chat/recommend', {
        query,
        context: {
          activity: 'creating_graph',
          graphType: currentGraph?.type || 'general',
          domain: currentGraph?.domain || 'general',
          experience: 'beginner',
          currentNodes: currentGraph?.nodes?.length || 0,
          currentEdges: currentGraph?.edges?.length || 0,
          graphComplexity: calculateGraphComplexity(currentGraph),
          userPreferences: getUserPreferences()
        }
      });

      return response.data.recommendations;
    } catch (error) {
      console.error('AI recommendation error:', error);
      return "I encountered an error while analyzing your graph. Please try again or contact support for assistance.";
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeCurrentGraph = async () => {
    if (!currentGraph) return null;
    
    try {
      setIsAnalyzing(true);
      const response = await axios.post('/api/chat/analyze', {
        graph: currentGraph
      });
      
      return response.data.analysis;
    } catch (error) {
      console.error('Graph analysis error:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Enhanced handleSend with AI processing
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      isBot: false,
      timestamp: new Date(),
      category: messageCategory
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      let response;
      const userInput = input.toLowerCase();
      
      // Update conversation history
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: input }
      ].slice(-10); // Keep last 10 messages for context
      setConversationHistory(updatedHistory);

      if (aiEnabled) {
        // Process with AI
        response = await processWithAI(
          input,
          updatedHistory,
          currentGraph
        );
      } else {
        // Fallback to traditional response matching
        if (userInput.includes('recommend') || userInput.includes('suggest')) {
          response = await getAIRecommendations(input);
        } else if (userInput.includes('analyze') && currentGraph) {
          response = await analyzeCurrentGraph();
        } else {
          response = findBestMatch(userInput);
        }
      }

      // Update suggested questions based on AI response
      const newSuggestions = await generateAISuggestions(input, response);
      setSuggestedQuestions(newSuggestions);

      // Add response to conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'assistant', content: response }
      ]);

      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          text: response,
          isBot: true,
          timestamp: new Date(),
          category: determineCategory(input)
        }]);
      }, 1000);

    } catch (error) {
      console.error('Error processing message:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        text: "I encountered an error. Please try again or contact support.",
        isBot: true,
        timestamp: new Date(),
        category: 'general',
        isError: true
      }]);
    }
  };

  // AI-powered suggestion generation
  const generateAISuggestions = async (input, lastResponse) => {
    try {
      const response = await axios.post('/api/chat/suggestions', {
        input,
        lastResponse,
        context: {
          currentGraph,
          conversationHistory,
          userPreferences: getUserPreferences()
        }
      });
      return response.data.suggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return generateDefaultSuggestions(determineCategory(input));
    }
  };

  const generateDefaultSuggestions = (category) => {
    switch (category) {
      case 'graphs':
        return [
          'How do I add more nodes?',
          'Can I change the layout?',
          'How to save my graph?'
        ];
      case 'nodes':
        return [
          'What node types are available?',
          'How to connect nodes?',
          'Can I customize node appearance?'
        ];
      default:
        return [
          'Tell me about graph types',
          'How to start a new project?',
          'What are the premium features?'
        ];
    }
  };

  // Add quick action handler
  const handleQuickAction = (action) => {
    switch (action) {
      case 'new_graph':
        navigate('/create-graph');
        break;
      case 'templates':
        setInput('Show me graph templates');
        handleSend();
        break;
      case 'help':
        setInput('What can you help me with?');
        handleSend();
        break;
      // Add more actions...
    }
  };

  return (
    <>
      <Fab
        component={motion.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        color="primary"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          bgcolor: '#64ffda',
          color: '#0a192f',
          '&:hover': { bgcolor: '#4caf50' },
        }}
      >
        <ChatIcon />
      </Fab>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            bgcolor: '#0a192f',
            borderLeft: '1px solid #233554',
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid #233554',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" color="#64ffda">
              NEXORAZ Assistant
            </Typography>
            <IconButton onClick={() => setIsOpen(false)} sx={{ color: '#64ffda' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Quick Actions */}
          <Box sx={{ p: 1, borderBottom: '1px solid #233554', display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <QuickActionButton
              label="New Graph"
              icon={<AddIcon />}
              onClick={() => handleQuickAction('new_graph')}
            />
            <QuickActionButton
              label="Templates"
              icon={<AutoGraphIcon />}
              onClick={() => handleQuickAction('templates')}
            />
            <QuickActionButton
              label="Help"
              icon={<HelpIcon />}
              onClick={() => handleQuickAction('help')}
            />
          </Box>

          {/* Messages Area */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Message {...message} />
                </motion.div>
              ))}
              {isTyping && <GraphLoadingIndicator />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </Box>

          {/* Suggested Questions */}
          {suggestedQuestions.length > 0 && (
            <Box sx={{ p: 1, borderTop: '1px solid #233554' }}>
              <Typography variant="caption" color="#64ffda" sx={{ pl: 1 }}>
                Suggested Questions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 1 }}>
                {suggestedQuestions.map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    onClick={() => {
                      setInput(question);
                      handleSend();
                    }}
                    sx={{
                      color: '#ccd6f6',
                      bgcolor: '#112240',
                      '&:hover': {
                        bgcolor: '#1a365d',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: '1px solid #233554', display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              multiline
              maxRows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ccd6f6',
                  '& fieldset': { borderColor: '#233554' },
                  '&:hover fieldset': { borderColor: '#64ffda' },
                  '&.Mui-focused fieldset': { borderColor: '#64ffda' },
                },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              sx={{
                color: '#64ffda',
                '&.Mui-disabled': { color: '#233554' },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default ChatBot; 