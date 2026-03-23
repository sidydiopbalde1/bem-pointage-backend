  ├──────────────┼────────────────────┤
  │ Email        │ admin@pointage.com │
  ├──────────────┼────────────────────┤
  │ Mot de passe │ Admin@1234         │
  ______________________________________


   npx prisma migrate resolve --applied 20260321000000_add_password_reset_and_token_blacklist                
  npx prisma migrate resolve --applied 20260322000000_add_work_schedule                                     
  npx prisma migrate dev --name add_holidays_and_absences 

   # 1. Marquer les migrations existantes comme déjà appliquées                                              
  npx prisma migrate resolve --applied 20260321000000_add_password_reset_and_token_blacklist
  npx prisma migrate resolve --applied 20260322000000_add_work_schedule                                     
                                                            
  # 2. Créer et appliquer la nouvelle migration (PublicHoliday + Absence)                                   
  npx prisma migrate dev --name add_holidays_and_absences   
                                                                                                            
  # (npx prisma generate est appelé automatiquement par migrate dev)                                        
   
  Si tu préfères repartir de zéro (données perdues) :                                                       
  npx prisma migrate reset   