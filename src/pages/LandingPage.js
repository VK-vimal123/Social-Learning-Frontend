import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Star, 
  Upload, 
  Search, 
  Shield,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Share your study notes with just a few clicks. Support for PDF, DOC, and image formats.',
      color: '#3b82f6'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find exactly what you need with our powerful search and filtering system.',
      color: '#10b981'
    },
    {
      icon: Users,
      title: 'Connect & Learn',
      description: 'Build your learning network and collaborate with fellow students.',
      color: '#8b5cf6'
    },
    {
      icon: Star,
      title: 'Rate & Review',
      description: 'Help others by rating and reviewing study materials.',
      color: '#f59e0b'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data and notes are protected with enterprise-grade security.',
      color: '#ef4444'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant access to study materials whenever you need them.',
      color: '#06b6d4'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Notes Shared' },
    { number: '100K+', label: 'Downloads' },
    { number: '4.8', label: 'Average Rating' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      content: 'Notes Exchange has completely transformed how I study. I can access high-quality notes from top students in my class.',
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Engineering Student',
      content: 'The platform is intuitive and the community is amazing. I\'ve improved my grades significantly!',
      avatar: 'MC'
    },
    {
      name: 'Emily Davis',
      role: 'Medical Student',
      content: 'Being able to share my notes and help others while earning recognition is incredibly rewarding.',
      avatar: 'ED'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)'
    }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '64px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <BookOpen style={{ color: '#667eea' }} size={32} />
              <span style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#111827'
              }}>
                Notes Exchange
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px'
            }}>
              <a href="#features" style={{
                color: '#374151',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#667eea'}
              onMouseLeave={(e) => e.target.style.color = '#374151'}>
                Features
              </a>
              <a href="#testimonials" style={{
                color: '#374151',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#667eea'}
              onMouseLeave={(e) => e.target.style.color = '#374151'}>
                Testimonials
              </a>
              <a href="#stats" style={{
                color: '#374151',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#667eea'}
              onMouseLeave={(e) => e.target.style.color = '#374151'}>
                Stats
              </a>
              <Link to="/login" style={{
                padding: '12px 24px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 15px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 16px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '896px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            Share Knowledge,
            <span style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Learn Together
            </span>
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            marginBottom: '32px',
            maxWidth: '672px',
            margin: '0 auto 32px',
            lineHeight: '1.6'
          }}>
            Join thousands of students sharing and accessing high-quality study notes. 
            Upload your materials, help others, and excel in your academic journey.
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/login" style={{
              padding: '16px 32px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}>
              Start Learning Now
            </Link>
            <button style={{
              padding: '16px 32px',
              borderRadius: '12px',
              background: 'white',
              color: '#374151',
              border: '2px solid #e5e7eb',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              e.target.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              e.target.style.borderColor = '#e5e7eb';
            }}>
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: '80px 16px',
        background: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Everything You Need to Excel
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '672px',
              margin: '0 auto'
            }}>
              Powerful features designed to make learning and sharing knowledge effortless
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '32px'
          }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #f3f4f6',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: `${feature.color}15`,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                  }}>
                    <Icon style={{ color: feature.color }} size={32} />
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '12px'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    lineHeight: '1.6'
                  }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" style={{
        padding: '80px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            textAlign: 'center'
          }}>
            {stats.map((stat, index) => (
              <div key={index}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '8px'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{
        padding: '80px 16px',
        background: '#f9fafb'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '16px'
            }}>
              What Students Say
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '672px',
              margin: '0 auto'
            }}>
              Join thousands of satisfied students who've transformed their learning experience
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '32px',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #f3f4f6'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    marginRight: '16px'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {testimonial.name}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  marginBottom: '12px'
                }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                  ))}
                </div>
                <p style={{
                  fontSize: '16px',
                  color: '#374151',
                  fontStyle: 'italic',
                  lineHeight: '1.6'
                }}>
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px'
          }}>
            Ready to Transform Your Learning?
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px'
          }}>
            Join thousands of students already benefiting from shared knowledge and collaborative learning.
          </p>
          <Link to="/login" style={{
            padding: '16px 32px',
            borderRadius: '12px',
            background: 'white',
            color: '#667eea',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
          }}>
            Get Started Free
          </Link>
        </div>
      </section>

      </div>
  );
};

export default LandingPage;
