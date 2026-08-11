import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, AlertTriangle, TrendingUp, Package, Layers, Truck, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { mockApi } from '../../services/mockApi';
import { useAuth } from '../../context/AuthContext';

export const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: '👋 Hello! I am **Inventra AI Assistant**. Ask me anything about your stock levels, best-selling products, orders, or suppliers!',
      time: 'Just now'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const quickQuestions = [
    { label: 'Low Stock Items', prompt: 'Which products are low in stock?', icon: AlertTriangle, color: '#EF4444' },
    { label: 'Best Sellers', prompt: 'What are my best-selling products?', icon: TrendingUp, color: '#22C55E' },
    { label: 'Monthly Orders', prompt: 'How many orders did we receive this month?', icon: Package, color: '#6366F1' },
    { label: 'Top Category', prompt: 'Which category has the highest revenue?', icon: Layers, color: '#0EA5E9' },
    { label: 'Top Supplier', prompt: 'Which supplier supplies the most products?', icon: Truck, color: '#7C3AED' }
  ];

  const handleSendMessage = async (customText) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customText) setInputPrompt('');
    setIsLoading(true);

    try {
      // Try live API backend first
      let aiResponseText = '';
      const response = await api.aiChat(textToSend);

      if (response && response.data && response.data.reply) {
        aiResponseText = response.data.reply;
      } else {
        // Local Client Intent Processing fallback
        aiResponseText = processLocalClientAI(textToSend);
      }

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      // Fallback client intelligence if backend API unavailable
      const fallbackText = processLocalClientAI(textToSend);
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: fallbackText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const processLocalClientAI = (prompt) => {
    const p = prompt.toLowerCase();
    const products = mockApi.getProducts();
    const orders = mockApi.getOrders();
    const suppliers = mockApi.getSuppliers();
    const categories = mockApi.getCategories();

    if (p.includes('low') || p.includes('threshold') || p.includes('out of stock')) {
      const low = products.filter(prd => prd.stock <= 10);
      if (low.length === 0) return '📦 **Inventra AI Stock Report**: Excellent! All products are currently above threshold levels.';
      const list = low.map(i => `- **${i.name}** (SKU: ${i.sku || 'N/A'}) — **${i.stock} units remaining** (₹${i.price})`).join('\n');
      return `⚠️ **Inventra AI Low Stock Report**:\nFound **${low.length} low stock items** (stock <= 10 units):\n\n${list}`;
    }

    if (p.includes('best') || p.includes('top selling') || p.includes('most sold')) {
      if (orders.length === 0) return '🏆 **Inventra AI Sales Intelligence**: No sales orders found for this workspace yet.';
      const salesMap = {};
      orders.forEach(o => {
        (o.items || []).forEach(item => {
          salesMap[item.name] = (salesMap[item.name] || 0) + item.quantity;
        });
      });
      const sorted = Object.keys(salesMap).sort((a, b) => salesMap[b] - salesMap[a]).slice(0, 5);
      const list = sorted.map((name, i) => `${i + 1}. **${name}** — ${salesMap[name]} units sold`).join('\n');
      return `🏆 **Inventra AI Best-Selling Products**:\n${list}`;
    }

    if (p.includes('order') || p.includes('month') || p.includes('received')) {
      const totalRev = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.amount : 0), 0);
      return `📦 **Inventra AI Order Metrics**:\n- Total Orders: **${orders.length} orders**\n- Realized Revenue: **₹${totalRev.toLocaleString()}**`;
    }

    if (p.includes('category') || p.includes('revenue category')) {
      const list = categories.map(c => `- **${c.name}**: ${c.productsCount} items`).join('\n');
      return `🏷️ **Inventra AI Category Distribution**:\n${list}`;
    }

    if (p.includes('supplier') || p.includes('vendor')) {
      if (suppliers.length === 0) return '🏢 **Inventra AI Vendor Intelligence**: No registered vendors.';
      const list = suppliers.map(s => `- **${s.name}** (${s.contactPerson || 'Vendor'}) — Supplies **${s.productsSupplied || 1} items**`).join('\n');
      return `🏢 **Inventra AI Vendor Intelligence**:\n${list}`;
    }

    return `🤖 **Inventra AI**: I am tracking **${products.length} products**, **${orders.length} orders**, and **${suppliers.length} vendors** in your current workspace.`;
  };

  return (
    <>
      {/* Floating Widget Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '1.75rem',
          right: '1.75rem',
          zIndex: 90,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          color: 'white',
          border: 'none',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        title="Inventra AI Assistant"
      >
        {isOpen ? <X size={24} /> : <Bot size={26} />}
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '5.5rem',
            right: '1.75rem',
            zIndex: 95,
            width: '380px',
            maxWidth: 'calc(100vw - 2rem)',
            height: '540px',
            maxHeight: 'calc(100vh - 7rem)',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'modalIn 0.2s ease-out'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0 }}>Inventra AI Assistant</h3>
                <span style={{ fontSize: '0.725rem', opacity: 0.9 }}>Powered by Gemini 2.5 & ERP Engine</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Question Chips */}
          <div
            style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: 'var(--bg-tertiary)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.prompt)}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
              >
                <q.icon size={13} style={{ color: q.color }} /> {q.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <div
                  style={{
                    padding: '0.75rem 0.95rem',
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-tertiary)',
                    color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-main)',
                    fontSize: '0.85rem',
                    lineHeight: '1.45',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {msg.text}
                </div>
                <div
                  style={{
                    fontSize: '0.675rem',
                    color: 'var(--text-light)',
                    marginTop: '0.2rem',
                    textAlign: msg.sender === 'user' ? 'right' : 'left'
                  }}
                >
                  {msg.time}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <RefreshCw size={14} className="spin" /> Inventra AI is analyzing workspace database...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'var(--card-bg)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              placeholder="Ask Inventra AI a question..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{
                flex: 1,
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                fontSize: '0.825rem',
                color: 'var(--text-main)'
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputPrompt.trim()}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: inputPrompt.trim() ? 'var(--primary)' : 'var(--bg-tertiary)',
                color: inputPrompt.trim() ? 'white' : 'var(--text-muted)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputPrompt.trim() ? 'pointer' : 'default'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
