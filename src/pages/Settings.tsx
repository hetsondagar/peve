import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Database,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Settings as SettingsIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Settings Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <GlassCard className="p-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-xl font-bold text-white">JD</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Settings</h1>
                  <p className="text-foreground-secondary">Manage your account preferences and privacy settings</p>
                </div>
          </div>
            </GlassCard>
          </motion.div>

          {/* Settings Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                {/* Profile Settings */}
                <TabsContent value="profile" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-400" />
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="John" />
                        </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Doe" />
                        </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                        </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input id="bio" defaultValue="Full Stack Developer passionate about creating amazing user experiences" />
                        </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" defaultValue="San Francisco, CA" />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button>Save Changes</Button>
                        </div>
                  </GlassCard>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-red-400" />
                      Security
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input 
                            id="currentPassword" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter current password"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" placeholder="Enter new password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button variant="outline">Change Password</Button>
                    </div>
                  </GlassCard>
                </motion.div>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-yellow-400" />
                      Notification Preferences
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">Email Notifications</h4>
                          <p className="text-sm text-foreground-secondary">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">Push Notifications</h4>
                          <p className="text-sm text-foreground-secondary">Receive push notifications on your device</p>
                        </div>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">SMS Notifications</h4>
                          <p className="text-sm text-foreground-secondary">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          checked={notifications.sms}
                          onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">Marketing Emails</h4>
                          <p className="text-sm text-foreground-secondary">Receive promotional and marketing emails</p>
                    </div>
                        <Switch
                          checked={notifications.marketing}
                          onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                        />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
                </TabsContent>

              {/* Privacy Settings */}
                <TabsContent value="privacy" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      Privacy & Security
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Profile Visibility</Label>
                        <Select defaultValue="public">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="connections">Connections Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Activity Status</Label>
                        <Select defaultValue="show">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="show">Show when online</SelectItem>
                            <SelectItem value="hide">Hide activity status</SelectItem>
                          </SelectContent>
                        </Select>
                          </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">Data Analytics</h4>
                          <p className="text-sm text-foreground-secondary">Allow us to collect usage data to improve our services</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">Third-party Integrations</h4>
                          <p className="text-sm text-foreground-secondary">Allow third-party services to access your data</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
                </TabsContent>

              {/* Appearance Settings */}
                <TabsContent value="appearance" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-purple-400" />
                      Theme & Appearance
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <div className="flex gap-4">
                          <Button
                            variant={theme === 'light' ? 'default' : 'outline'}
                            onClick={() => theme !== 'light' && toggleTheme()}
                            className="flex items-center gap-2"
                          >
                            <Sun className="w-4 h-4" />
                            Light
                          </Button>
                          <Button
                            variant={theme === 'dark' ? 'default' : 'outline'}
                            onClick={() => theme !== 'dark' && toggleTheme()}
                            className="flex items-center gap-2"
                          >
                            <Moon className="w-4 h-4" />
                            Dark
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Font Size</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
                </TabsContent>

              {/* Advanced Settings */}
              <TabsContent value="advanced" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Database className="w-5 h-5 text-orange-400" />
                      Data Management
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">Export Data</h4>
                          <p className="text-sm text-foreground-secondary">Download a copy of your data</p>
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Export
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">Import Data</h4>
                          <p className="text-sm text-foreground-secondary">Import data from another service</p>
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Import
                        </Button>
                          </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground text-red-400">Delete Account</h4>
                          <p className="text-sm text-foreground-secondary">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive" className="flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
                </TabsContent>
              </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}