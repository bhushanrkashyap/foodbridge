import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TeamPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: 'Chinmay S N',
      role: 'Frontend Developer',
      department: 'ECE',
      year: '3rd Year',
      expertise: ['React.js', 'UI/UX Design', 'Responsive Web'],
      description: 'Passionate about creating seamless user experiences and beautiful interfaces.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chinmay&skinColor=brown&hair=short01,short02,short03&hairColor=black,brown&eyes=default&mouth=smile&facialHair=blank',
      gradient: 'from-blue-500 to-cyan-500',
      socialLinks: {
        github: '#',
        linkedin: '#',
        email: 'chinmay@foodbridge.com'
      }
    },
    {
      id: 2,
      name: 'Bhushan R',
      role: 'Backend Developer',
      department: 'CSE',
      year: '3rd Year',
      expertise: ['Node.js', 'Database Design', 'API Development'],
      description: 'Building robust and scalable backend systems to power FoodBridge.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bhushan&skinColor=brown&hair=shortFlat,shortWaved&hairColor=black,brown&eyes=default&mouth=smile&facialHair=blank',
      gradient: 'from-purple-500 to-pink-500',
      socialLinks: {
        github: '#',
        linkedin: '#',
        email: 'bhushan@foodbridge.com'
      }
    },
    {
      id: 3,
      name: 'Srujan M',
      role: 'AI Engineer',
      department: 'AIDS',
      year: '3rd Year',
      expertise: ['Machine Learning', 'Data Analytics', 'AI Models'],
      description: 'Leveraging AI to optimize food distribution and reduce waste intelligently.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Srujan&skinColor=brown&hair=short04,short05&hairColor=black,brown&eyes=default&mouth=smile&facialHair=blank',
      gradient: 'from-green-500 to-emerald-500',
      socialLinks: {
        github: '#',
        linkedin: '#',
        email: 'srujan@foodbridge.com'
      }
    },
    {
      id: 4,
      name: 'Ayush H R',
      role: 'AI Engineer',
      department: 'AIDS',
      year: '3rd Year',
      expertise: ['Deep Learning', 'Predictive Analytics', 'Algorithm Design'],
      description: 'Developing intelligent algorithms for smart food matching and predictions.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AyushHR&skinColor=brown&hair=short06,short07&hairColor=black,brown&eyes=default&mouth=smile&facialHair=blank',
      gradient: 'from-orange-500 to-red-500',
      socialLinks: {
        github: '#',
        linkedin: '#',
        email: 'ayush@foodbridge.com'
      }
    }
  ];

  const stats = [
    { icon: 'Users', value: '4', label: 'Team Members' },
    { icon: 'Code', value: '10K+', label: 'Lines of Code' },
    { icon: 'Coffee', value: '∞', label: 'Coffee Cups' },
    { icon: 'Award', value: '100%', label: 'Dedication' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader
        userRole="guest"
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-success/5" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Icon name="Users" size={16} className="text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Meet Our Amazing Team</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
            The Minds Behind
            <span className="block bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent mt-2">
              FoodBridge
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We're a passionate group of students from <strong>Global Academy of Technology</strong>,
            united by our mission to reduce food waste and fight hunger through innovative technology.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl p-6 border border-border shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name={stat.icon} size={24} className="text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Avatar Section */}
                <div className="relative pt-8 pb-6 px-6">
                  <div className="relative">
                    {/* Animated Ring */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 scale-110`} />
                    
                    {/* Avatar */}
                    <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-background shadow-lg ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-xl font-heading font-bold text-foreground text-center mb-1 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className={`text-sm font-medium bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent text-center mb-3`}>
                    {member.role}
                  </p>

                  {/* Department Badge */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <Icon name="GraduationCap" size={14} className="text-primary mr-1.5" />
                      <span className="text-xs font-medium text-primary">{member.department}</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                      <span className="text-xs font-medium text-accent">{member.year}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed">
                    {member.description}
                  </p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {member.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-xs font-medium bg-muted rounded-full text-foreground border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-3 pt-4 border-t border-border">
                    <a
                      href={member.socialLinks.github}
                      className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-all duration-300 hover:scale-110 group/icon"
                    >
                      <Icon name="Github" size={18} className="text-muted-foreground group-hover/icon:text-primary transition-colors" />
                    </a>
                    <a
                      href={member.socialLinks.linkedin}
                      className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-all duration-300 hover:scale-110 group/icon"
                    >
                      <Icon name="Linkedin" size={18} className="text-muted-foreground group-hover/icon:text-primary transition-colors" />
                    </a>
                    <a
                      href={`mailto:${member.socialLinks.email}`}
                      className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-all duration-300 hover:scale-110 group/icon"
                    >
                      <Icon name="Mail" size={18} className="text-muted-foreground group-hover/icon:text-primary transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* College Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-success/10 rounded-2xl p-8 md:p-12 border border-primary/20">
            <Icon name="School" size={48} className="text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Global Academy of Technology
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're proud students of GAT, applying our academic knowledge to solve real-world problems
              and make a positive impact on society through innovative technological solutions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-background border border-border">
                <Icon name="MapPin" size={16} className="text-primary mr-2" />
                <span className="text-sm font-medium text-foreground">Bangalore, Karnataka</span>
              </div>
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-background border border-border">
                <Icon name="Award" size={16} className="text-primary mr-2" />
                <span className="text-sm font-medium text-foreground">AICTE Approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
            Join Us in Our Mission
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Together, we can make a difference in fighting food waste and hunger.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="default" size="lg" iconName="UserPlus" iconPosition="left">
                Get Started
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" iconName="Mail" iconPosition="left">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FoodBridge. Built with ❤️ by GAT Students.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TeamPage;
