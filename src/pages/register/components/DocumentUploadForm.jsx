import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DocumentUploadForm = ({ userType, formData, onFormChange, errors, className = '' }) => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragOver, setDragOver] = useState(null);

  const getRequiredDocuments = () => {
    switch (userType) {
      case 'restaurant':
        return [
          {
            id: 'fssai',
            label: 'FSSAI License',
            description: 'Food Safety and Standards Authority license',
            required: true,
            accept: '.pdf,.jpg,.jpeg,.png'
          },
          {
            id: 'business',
            label: 'Business Registration',
            description: 'Shop establishment license or business registration',
            required: true,
            accept: '.pdf,.jpg,.jpeg,.png'
          },
          {
            id: 'gst',
            label: 'GST Certificate',
            description: 'GST registration certificate (if applicable)',
            required: false,
            accept: '.pdf,.jpg,.jpeg,.png'
          }
        ];
      case 'ngo':
        return [
          {
            id: 'registration',
            label: 'NGO Registration',
            description: '12A/80G certificate or Trust deed',
            required: true,
            accept: '.pdf,.jpg,.jpeg,.png'
          },
          {
            id: 'pan',
            label: 'PAN Card',
            description: 'Organization PAN card',
            required: true,
            accept: '.pdf,.jpg,.jpeg,.png'
          },
          {
            id: 'address',
            label: 'Address Proof',
            description: 'Utility bill or rent agreement',
            required: false,
            accept: '.pdf,.jpg,.jpeg,.png'
          }
        ];
      default:
        return [];
    }
  };

  const documents = getRequiredDocuments();

  const handleFileSelect = (documentId, file) => {
    if (!file) return;

    // Validate file size (max 5MB)
    if (file?.size > 5 * 1024 * 1024) {
      onFormChange(`${documentId}Error`, 'File size must be less than 5MB');
      return;
    }

    // Simulate upload progress
    setUploadProgress(prev => ({ ...prev, [documentId]: 0 }));
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev?.[documentId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [documentId]: currentProgress + 10 };
      });
    }, 100);

    // Store file in form data
    onFormChange(documentId, file);
    onFormChange(`${documentId}Error`, '');
  };

  const handleDragOver = (e, documentId) => {
    e?.preventDefault();
    setDragOver(documentId);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e, documentId) => {
    e?.preventDefault();
    setDragOver(null);
    const files = e?.dataTransfer?.files;
    if (files?.length > 0) {
      handleFileSelect(documentId, files?.[0]);
    }
  };

  const removeFile = (documentId) => {
    onFormChange(documentId, null);
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress?.[documentId];
      return newProgress;
    });
  };

  return (
    <div className={`document-upload-form ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Document Verification
        </h2>
        <p className="text-muted-foreground">
          Upload required documents for account verification
        </p>
      </div>
      <div className="space-y-6">
        {documents?.map((doc) => (
          <div key={doc?.id} className="border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading font-semibold text-foreground flex items-center">
                  {doc?.label}
                  {doc?.required && (
                    <span className="text-error ml-1">*</span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {doc?.description}
                </p>
              </div>
              
              {formData?.[doc?.id] && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => removeFile(doc?.id)}
                  className="text-muted-foreground hover:text-error"
                />
              )}
            </div>

            {!formData?.[doc?.id] ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver === doc?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
                onDragOver={(e) => handleDragOver(e, doc?.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, doc?.id)}
              >
                <Icon name="Upload" size={32} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <Input
                  type="file"
                  accept={doc?.accept}
                  onChange={(e) => handleFileSelect(doc?.id, e?.target?.files?.[0])}
                  className="hidden"
                  id={`file-${doc?.id}`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Upload"
                  iconPosition="left"
                  onClick={() => document.getElementById(`file-${doc?.id}`)?.click()}
                >
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  PDF, JPG, PNG up to 5MB
                </p>
              </div>
            ) : (
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <Icon name="FileText" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {formData?.[doc?.id]?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(formData?.[doc?.id]?.size / 1024 / 1024)?.toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  {uploadProgress?.[doc?.id] !== undefined && uploadProgress?.[doc?.id] < 100 ? (
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-border rounded-full mr-2">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-200"
                          style={{ width: `${uploadProgress?.[doc?.id]}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {uploadProgress?.[doc?.id]}%
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center text-success">
                      <Icon name="CheckCircle" size={16} className="mr-1" />
                      <span className="text-xs">Uploaded</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {errors?.[`${doc?.id}Error`] && (
              <p className="text-error text-sm mt-2 flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {errors?.[`${doc?.id}Error`]}
              </p>
            )}
          </div>
        ))}

        {/* Upload Guidelines */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-heading font-semibold text-foreground mb-2 flex items-center">
            <Icon name="Info" size={16} className="mr-2" />
            Upload Guidelines
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Ensure documents are clear and readable</li>
            <li>• All text and details should be visible</li>
            <li>• Documents should be valid and not expired</li>
            <li>• File size should not exceed 5MB per document</li>
            <li>• Supported formats: PDF, JPG, PNG</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadForm;