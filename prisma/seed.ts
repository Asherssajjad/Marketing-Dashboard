const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Create first user
  const admin = await prisma.user.create({
    data: {
      name: "Asher Admin",
      email: "asher@axion.com",
      role: "ADMIN",
    }
  })

  // Create some clients
  const client1 = await prisma.client.create({
    data: {
      name: "Luxe E-commerce",
      contact: "hello@luxe.com",
      platforms: ["Instagram", "Facebook", "TikTok"],
      status: "ACTIVE",
      createdBy: admin.id,
      packages: {
        create: {
          name: "Scale Master",
          price: 1500,
          reels_pm: 8,
          posts_pm: 12,
          has_ads: true,
          monthlyPlans: {
            create: {
              month: 10,
              year: 2024,
              status: "ACTIVE",
              contentItems: {
                create: [
                  { type: "REEL", status: "PUBLISHED", notes: "Product showcase reel" },
                  { type: "REEL", status: "PLANNED", notes: "Behind the scenes" },
                  { type: "POST", status: "PUBLISHED", notes: "Fall collection carousel" },
                ]
              }
            }
          }
        }
      },
      projects: {
        create: {
          name: "2024 Site Redesign",
          type: "Website",
          status: "DEVELOPMENT",
          milestones: [
            { id: 1, title: "Discovery", completed: true },
            { id: 2, title: "Design", completed: true },
            { id: 3, title: "Frontend", completed: false }
          ]
        }
      }
    }
  })

  const client2 = await prisma.client.create({
    data: {
      name: "Global Tech Solutions",
      contact: "billing@globaltech.com",
      platforms: ["LinkedIn", "Twitter"],
      status: "ACTIVE",
      createdBy: admin.id,
      packages: {
        create: {
          name: "Executive Growth",
          price: 3200,
          reels_pm: 0,
          posts_pm: 20,
          has_ads: false,
          monthlyPlans: {
            create: {
              month: 10,
              year: 2024,
              status: "ACTIVE",
              contentItems: {
                create: [
                  { type: "POST", status: "PUBLISHED", notes: "Industry whitepaper" },
                  { type: "POST", status: "PUBLISHED", notes: "Webinar announcement" },
                ]
              }
            }
          }
        }
      }
    }
  })

  // Add some global tasks
  await prisma.task.createMany({
    data: [
      { title: "Review Luxe Ads", status: "TODO", clientId: client1.id },
      { title: "Invoice Global Tech", status: "DONE", clientId: client2.id },
      { title: "Update Design System", status: "IN_PROGRESS" } // Internal
    ]
  })

  // Add payments
  await prisma.payment.create({
    data: {
      clientId: client1.id,
      month: 10,
      year: 2024,
      amount: 1500,
      status: "PAID",
      paidOn: new Date(),
      invoices: {
        create: {
          invoiceNo: "AXN-2024-8172",
          pdfUrl: "mock_url"
        }
      }
    }
  })

  console.log("Seeding finished.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
