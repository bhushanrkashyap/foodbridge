import React from 'react';
import Icon from '../../../components/AppIcon';

const AIMatchingScore = ({ matchingData }) => {
  const {
    overallScore,
    compatibilityFactors,
    beneficiaryAlignment,
    logisticsScore,
    urgencyMatch,
    recommendations,
    confidenceLevel
  } = matchingData;

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-primary';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-success/10';
    if (score >= 75) return 'bg-primary/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getFactorIcon = (factor) => {
    const icons = {
      'dietary-compatibility': 'Utensils',
      'location-proximity': 'MapPin',
      'quantity-match': 'Package',
      'timing-alignment': 'Clock',
      'beneficiary-needs': 'Users',
      'pickup-capacity': 'Truck'
    };
    return icons?.[factor] || 'CheckCircle';
  };

  const renderProgressBar = (score) => {
    return (
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            score >= 90 ? 'bg-success' :
            score >= 75 ? 'bg-primary' :
            score >= 60 ? 'bg-warning' : 'bg-error'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg shadow-soft overflow-hidden">
      {/* Header with Overall Score */}
      <div className={`p-6 ${getScoreBg(overallScore)} border-b border-border`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Sparkles" size={20} className="text-primary" />
            <h3 className="text-lg font-heading font-semibold text-foreground">
              AI Compatibility Score
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full font-medium">
              {confidenceLevel}% Confidence
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className={`text-4xl font-mono font-bold ${getScoreColor(overallScore)} mb-1`}>
              {overallScore}
            </div>
            <div className="text-sm text-muted-foreground">Overall Match</div>
          </div>
          
          <div className="flex-1">
            {renderProgressBar(overallScore)}
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Poor</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-foreground">
          <Icon name="Info" size={14} className="inline mr-2" />
          This donation is a <strong className={getScoreColor(overallScore)}>
            {overallScore >= 90 ? 'perfect' : overallScore >= 75 ? 'great' : overallScore >= 60 ? 'good' : 'fair'}
          </strong> match for your organization's needs.
        </div>
      </div>
      {/* Compatibility Factors */}
      <div className="p-6 border-b border-border">
        <h4 className="text-sm font-heading font-semibold text-foreground mb-4">
          Compatibility Breakdown
        </h4>
        
        <div className="space-y-4">
          {compatibilityFactors?.map((factor) => (
            <div key={factor?.type} className="flex items-center space-x-3">
              <Icon 
                name={getFactorIcon(factor?.type)} 
                size={16} 
                className="text-muted-foreground" 
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {factor?.type?.replace('-', ' ')}
                  </span>
                  <span className={`text-sm font-mono font-semibold ${getScoreColor(factor?.score)}`}>
                    {factor?.score}%
                  </span>
                </div>
                {renderProgressBar(factor?.score)}
                <div className="text-xs text-muted-foreground mt-1">
                  {factor?.explanation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Beneficiary Alignment */}
      <div className="p-6 border-b border-border">
        <h4 className="text-sm font-heading font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Users" size={16} className="mr-2" />
          Beneficiary Alignment
        </h4>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className={`text-2xl font-mono font-bold ${getScoreColor(beneficiaryAlignment?.dietaryMatch)} mb-1`}>
              {beneficiaryAlignment?.dietaryMatch}%
            </div>
            <div className="text-xs text-muted-foreground">Dietary Match</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-mono font-bold ${getScoreColor(beneficiaryAlignment?.quantityFit)} mb-1`}>
              {beneficiaryAlignment?.quantityFit}%
            </div>
            <div className="text-xs text-muted-foreground">Quantity Fit</div>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-foreground">
            <Icon name="Target" size={14} className="inline mr-2 text-primary" />
            <strong>Serves {beneficiaryAlignment?.estimatedBeneficiaries} people</strong> based on your typical serving sizes
          </div>
        </div>
      </div>
      {/* Logistics & Urgency */}
      <div className="p-6 border-b border-border">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center">
              <Icon name="Truck" size={16} className="mr-2" />
              Logistics Score
            </h4>
            <div className="text-center">
              <div className={`text-3xl font-mono font-bold ${getScoreColor(logisticsScore?.overall)} mb-2`}>
                {logisticsScore?.overall}%
              </div>
              {renderProgressBar(logisticsScore?.overall)}
              <div className="text-xs text-muted-foreground mt-2">
                {logisticsScore?.distance} km • {logisticsScore?.estimatedTime} pickup
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center">
              <Icon name="Clock" size={16} className="mr-2" />
              Urgency Match
            </h4>
            <div className="text-center">
              <div className={`text-3xl font-mono font-bold ${getScoreColor(urgencyMatch?.score)} mb-2`}>
                {urgencyMatch?.score}%
              </div>
              {renderProgressBar(urgencyMatch?.score)}
              <div className="text-xs text-muted-foreground mt-2">
                {urgencyMatch?.timeWindow} window
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* AI Recommendations */}
      <div className="p-6">
        <h4 className="text-sm font-heading font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Lightbulb" size={16} className="mr-2" />
          AI Recommendations
        </h4>
        
        <div className="space-y-3">
          {recommendations?.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Icon 
                name={rec?.type === 'suggestion' ? 'CheckCircle' : rec?.type === 'warning' ? 'AlertTriangle' : 'Info'} 
                size={14} 
                className={`mt-0.5 ${
                  rec?.type === 'suggestion' ? 'text-success' : 
                  rec?.type === 'warning' ? 'text-warning' : 'text-primary'
                }`}
              />
              <div className="text-sm text-foreground leading-relaxed">
                {rec?.message}
              </div>
            </div>
          ))}
        </div>

        {/* Action Suggestion */}
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center text-sm text-primary font-medium">
            <Icon name="Zap" size={14} className="mr-2" />
            Recommended Action: Accept this donation for optimal impact
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMatchingScore;